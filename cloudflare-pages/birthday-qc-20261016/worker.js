import {deliverQueue} from './delivery.js';
import {portal} from './portal.js';
import {formHtml} from "./presentation.js";
import {policyFor,agreementFor,quote,PAYMENT_COPY,POLICY} from './billing.js';
import {queueInvoice,deliverInvoices,invoiceApi} from './invoicing.js';
import agreements from "./agreements.json";
import { DAY, PACKAGES, packageConfig, NOTES, deadline, optionalDeadline, formatDate, validateDetails, reminderSchedule, waiverStatus, torontoTime } from "./domain.js";
import { random, hash, token, equal, escape as e } from "./security.js";
import { zoho, send } from "./mail.js";
import { parseBookings, trusted, verifiedDeposit, invoiceLines, isPastBirthdayReceipt } from "./booking.js";
import { links, emailFor, finish, packageCopy } from "./emails.js";
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" } });
const fail = (message, status = 400) => {
  throw Object.assign(Error(message), { status });
};
const query = (env, sql, ...args) => env.DB.prepare(sql).bind(...args);
const read = (env, sql, ...args) => query(env, sql, ...args).first();
const all = async (env, sql, ...args) => (await query(env, sql, ...args).all()).results;
const stmtMessage = (env, id, pid, kind, when) => query(env, "INSERT OR IGNORE INTO messages(id,party_id,kind,due_at) VALUES(?,?,?,?)", id, pid, kind, when);
async function body(req) {
  if (Number(req.headers.get("Content-Length")) > 3e4) fail("Request is too large", 413);
  const text = await req.text();
  if (text.length > 3e4) fail("Request is too large", 413);
  try {
    return JSON.parse(text);
  } catch {
    fail("Invalid request");
  }
}
const bearer = (req) => req.headers.get("Authorization")?.replace(/^Bearer /, "") || "";
async function party(env, req, kind = "host") {
  const id = new URL(req.url).searchParams.get("party");
  if (!/^[a-f0-9-]{36}$/.test(id || "")) fail("This party link is not valid", 404);
  const p = await read(env, "SELECT * FROM parties WHERE id=?", id);
  if (!p || !equal(bearer(req), await token(env.TOKEN_SECRET, kind, p))) fail("This party link is not valid", 403);
  if (p.status !== "active") fail("This booking needs to be checked by Leap. Please contact info@leapgymnastics.ca.", 409);
  return p;
}
async function staff(env, req) {
  const value = bearer(req);
  if (!value || !await read(env, "SELECT token_hash FROM sessions WHERE token_hash=? AND kind='staff' AND expires_at>?", await hash(value), Date.now())) fail("Please sign in again", 401);
}
async function view(env, p, includeDraft = false) {
  const rows = await all(env, "SELECT w.child_name FROM waivers w WHERE w.party_id=? AND json_extract(w.payload,'$.partyStart')=? AND NOT EXISTS(SELECT 1 FROM waivers newer WHERE newer.party_id=w.party_id AND json_extract(newer.payload,'$.supersedes')=w.id)", p.id, p.start_at);
  const draft = includeDraft ? await read(env,"SELECT value FROM state WHERE key=?",'party-draft:'+p.id) : null;
  return { id: p.id, invoice: p.invoice, child_name: p.child_name, start_at: p.start_at, finish_at: finish(p), package: p.package, packageCopy: packageCopy(p), config: packageConfig(p), formHtml: formHtml(p), deadline: deadline(p), optionalDeadline: optionalDeadline(p), details: JSON.parse(p.details || "null"), ...(includeDraft?{draft:draft?JSON.parse(draft.value):null}:{}), extras: JSON.parse(p.extras || "{}"), waivers: waiverStatus(JSON.parse(p.roster || "[]"), rows), waiversReceived: rows.length, links: await links(env, p), updated_at: p.updated_at, agreements:agreementFor(p,agreements), notes:policyFor(p)?{...NOTES,payment:PAYMENT_COPY}:NOTES };
}
async function saveDraft(env,p,input){
  if(input.revision!==p.updated_at)fail('These details changed in another window. Reload before saving.',409);
  if(Date.now()>finish(p))fail('This party has finished. Please contact Leap for corrections.',409);
  const allowed=['childName','childAge','phone','children','ageRange','independent','support','colours','loot','beverages','food','delivery','foodAdult','decor','roster','agreements','independentAcknowledged'];
  const data=Object.fromEntries(allowed.filter(k=>Object.hasOwn(input,k)).map(k=>[k,input[k]]));
  for(const [key,value] of Object.entries(data)){
    if(['colours','food','roster'].includes(key)){
      if(!Array.isArray(value)||value.length>100||value.some(x=>typeof x!=='string'||x.length>200))fail('Please check your saved form entries.');
    }else if(key==='agreements'){
      if(!value||typeof value!=='object'||Array.isArray(value)||Object.values(value).some(x=>typeof x!=='boolean'))fail('Please check your saved form entries.');
    }else if(['beverages','delivery','independentAcknowledged'].includes(key)){
      if(typeof value!=='boolean')fail('Please check your saved form entries.');
    }else if(!['string','number'].includes(typeof value)||String(value).length>2000)fail('Please check your saved form entries.');
  }
  const now=Math.max(Date.now(),p.updated_at+1);
  const result=await env.DB.batch([
    query(env,'UPDATE parties SET updated_at=? WHERE id=? AND updated_at=?',now,p.id,p.updated_at),
      query(env,"INSERT INTO state(key,value) SELECT ?,? WHERE changes()=1 ON CONFLICT(key) DO UPDATE SET value=excluded.value",'party-draft:'+p.id,JSON.stringify({data,savedAt:now}))
  ]);
  if(!result[0].meta.changes)fail('These details changed in another window. Reload before saving.',409);
  return json({saved:true,submitted:false,party:await view(env,await read(env,'SELECT * FROM parties WHERE id=?',p.id),true)});
}
async function saveDetails(env, p, input, ctx) {
  if(input.action==='save')return saveDraft(env,p,input);
  if (input.revision !== p.updated_at) fail("These details changed in another window. Reload the summary before editing.", 409);
  if (Date.now() > finish(p)) fail("This party has finished. Please contact Leap for corrections.", 409);
  const result = validateDetails(p, input, Date.now(), agreementFor(p,agreements).map((a) => a.key));
  if (result.errors.length) return json({ errors: result.errors }, 422);
  const d = result.details, old = JSON.parse(p.details || "null"), extras = JSON.parse(p.extras || "{}"), now = Math.max(Date.now(), p.updated_at + 1);

  const statements = [query(env, "UPDATE parties SET details=?,roster=?,child_name=?,extras=?,updated_at=? WHERE id=? AND updated_at=?", JSON.stringify(d), JSON.stringify(d.roster), d.childName, JSON.stringify(extras), now, p.id, p.updated_at), query(env, "UPDATE messages SET status='skipped' WHERE party_id=? AND kind LIKE 'details-%' AND status='pending' AND EXISTS(SELECT 1 FROM parties WHERE id=? AND updated_at=?)", p.id, p.id, now), query(env, "INSERT OR IGNORE INTO messages(id,party_id,kind,due_at) SELECT ?,?,'receipt',? WHERE EXISTS(SELECT 1 FROM parties WHERE id=? AND updated_at=?)", `${p.id}:receipt:${now}`, p.id, now, p.id, now), query(env, "INSERT INTO events(party_id,action,at,detail) SELECT ?,'details-saved',?,? WHERE EXISTS(SELECT 1 FROM parties WHERE id=? AND updated_at=?)", p.id, now, JSON.stringify({ agreementVersion: "20261009-reviewed" }), p.id, now)];
  statements.push(query(env, "INSERT OR IGNORE INTO messages(id,party_id,kind,due_at) SELECT ?,?,'staff-prep',? WHERE EXISTS(SELECT 1 FROM parties WHERE id=? AND updated_at=?)", `${p.id}:staff-prep:${now}`, p.id, now, p.id, now));
  statements.push(query(env,"DELETE FROM state WHERE key=? AND EXISTS(SELECT 1 FROM parties WHERE id=? AND updated_at=?)",'party-draft:'+p.id,p.id,now));
  let invoiceStatement;
  try { invoiceStatement=await queueInvoice(env,p,d,now,now); }
  catch(error){statements.push(query(env,"INSERT INTO state(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",'invoice-retry:'+p.id,JSON.stringify({at:now,error:String(error.message)})));}
  if(invoiceStatement)statements.push(invoiceStatement);
  if(policyFor(p)&&env.INVOICE_MODE!=='live') {
    let payload,status='preview_only';
    try{payload=quote(p,d);}catch(error){payload={review:error.message};status='needs_review';}
    const encoded=JSON.stringify(payload),fingerprint=await hash(encoded);
    statements.push(query(env,"INSERT INTO invoice_previews(party_id,fingerprint,status,payload,updated_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM parties WHERE id=? AND updated_at=?) ON CONFLICT(party_id) DO UPDATE SET fingerprint=excluded.fingerprint,status=excluded.status,payload=excluded.payload,updated_at=excluded.updated_at WHERE invoice_previews.fingerprint<>excluded.fingerprint",p.id,fingerprint,status,encoded,now,p.id,now));
  }
  const resultBatch = await env.DB.batch(statements);
  if (!resultBatch[0].meta.changes) fail("These details changed in another window. Please reload.", 409);
  if(env.INVOICE_MODE==='live'&&ctx?.waitUntil)ctx.waitUntil(deliverInvoices(env,p.id));
  return json({ saved: true, submitted:true, party: await view(env, await read(env, "SELECT * FROM parties WHERE id=?", p.id),true) });
}
async function login(env, req) {
  const ip = req.headers.get("CF-Connecting-IP") || "unknown", now = Date.now();
  const key = await hash("login-rate:" + ip + ":" + Math.floor(now / 3e5));
  const r = await query(env, "INSERT OR IGNORE INTO sessions(token_hash,kind,expires_at) VALUES(?,'rate',?)", key, now + 3e5).run();
  if (!r.meta.changes) fail("A sign-in link was requested recently. Please check the Leap inbox.", 429);
  const code = random() + random();
  await query(env, "INSERT INTO sessions(token_hash,kind,expires_at) VALUES(?,'magic',?)", await hash(code), now + 9e5).run();
  await send(env, "info@leapgymnastics.ca", "Sign in to Leap birthday preparation", `<p>A sign-in link was requested for the private Leap birthday preparation page.</p><p><a href="${e(env.PUBLIC_ORIGIN)}/staff/#login=${code}">Sign in to birthday preparation</a></p><p>This link expires in 15 minutes. If you did not request it, ignore this email.</p>`);
  return json({ sent: true });
}
async function exchange(env, input) {
  if (typeof input.token !== "string" || input.token.length > 100) fail("Invalid sign-in link", 401);
  const h = await hash(input.token), now = Date.now();
  const claim = await query(env, "UPDATE sessions SET used=1 WHERE token_hash=? AND kind='magic' AND used=0 AND expires_at>?", h, now).run();
  if (!claim.meta.changes) fail("This sign-in link has expired or has already been used.", 401);
  const session = random() + random();
  await query(env, "INSERT INTO sessions(token_hash,kind,expires_at) VALUES(?,'staff',?)", await hash(session), now + 8 * 36e5).run();
  return json({ token: session });
}
async function saveWaiver(env, p, input, req) {
  const required = ["participantName", "participantDob", "contactEmail", "contactPhone", "participantSignature"];
  const text = {};
  for (const key of required) {
    const value = typeof input[key] === "string" ? input[key].trim() : "";
    if (value.length < 2 || value.length > 200) fail("Please complete all required participant and parent or guardian fields.");
    text[key] = value;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text.participantDob) || !/^\S+@\S+\.\S+$/.test(text.contactEmail) || text.contactPhone.replace(/\D/g, "").length < 7) fail("Please check the participant date of birth and contact details.");
  const dob = /* @__PURE__ */ new Date(text.participantDob + "T12:00:00Z");
  if (!Number.isFinite(+dob) || dob.toISOString().slice(0, 10) !== text.participantDob || +dob > Date.now() || dob.getUTCFullYear() < 1900) fail("Please check the participant date of birth.");
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" }).format(/* @__PURE__ */ new Date());
  let age = Number(today.slice(0, 4)) - Number(text.participantDob.slice(0, 4));
  if (today.slice(5) < text.participantDob.slice(5)) age--;
  for (const key of ["guardianName", "guardianSignature"]) {
    text[key] = typeof input[key] === "string" ? input[key].trim() : "";
    if (text[key].length > 200 || age < 18 && text[key].length < 2) fail("Please complete the parent or guardian name and signature.");
  }
  for (const key of ["ack12", "ack34", "ack57", "electronicConsent", "finalConfirmation"]) if (input[key] !== true) fail("Please confirm each consent section.");
  if (input.agreementVersion !== "2026-2027") fail("Please reload the current agreement before signing.");
  if (Date.now() > finish(p) + DAY) fail("This party has finished. Contact Leap if a consent record needs correcting.", 409);
  if (!/^[a-f0-9-]{36}$/.test(input.submissionId || "")) fail("Invalid submission reference");
  const existing = await read(env, "SELECT id FROM waivers WHERE id=? AND party_id=?", input.submissionId, p.id);
  if (existing) return json({ success: true, reference: existing.id });
  const count = await read(env, "SELECT COUNT(*) AS n FROM waivers WHERE party_id=? AND submitted_at>?", p.id, Date.now() - 36e5);
  if (count.n >= 60) fail("We have received many submissions for this party recently. Please try again later.", 429);
  let supersedes=null;
  if(input.supersedes){
    const prior=await read(env,'SELECT payload FROM waivers WHERE id=? AND party_id=?',input.supersedes,p.id);
    if(!prior||!input.editKey||!equal(JSON.parse(prior.payload).editKeyHash,await hash(input.editKey)))fail('Please use the browser where you submitted this consent form to update it.',403);
    if(await read(env,"SELECT id FROM waivers WHERE party_id=? AND json_extract(payload,'$.supersedes')=?",p.id,input.supersedes))fail('A newer version of this consent form has already been submitted.',409);
    supersedes=input.supersedes;
  }
  if(input.editKey&&!/^[a-f0-9]{64}$/.test(input.editKey))fail('Invalid consent edit reference');
  const now = Date.now(), record = { ...text, ...(input.editKey?{editKeyHash:await hash(input.editKey)}:{}), ...(supersedes?{supersedes}:{}), agreementVersion: input.agreementVersion, ack12: true, ack34: true, ack57: true, electronicConsent: true, finalConfirmation: true, partyStart: p.start_at, partyVersion: p.version, submittedAt: new Date(now).toISOString() };
  await env.DB.batch([query(env, "INSERT OR IGNORE INTO waivers(id,party_id,child_name,parent_name,submitted_at,legal_version,payload) VALUES(?,?,?,?,?,?,?)", input.submissionId, p.id, text.participantName, text.guardianName, now, "2026-2027", JSON.stringify(record)), query(env, "INSERT INTO events(party_id,action,at,detail) VALUES(?,'waiver-received',?,?)", p.id, now, JSON.stringify({ reference: input.submissionId })), ...['consent-parent','consent-staff'].map(kind=>query(env,"INSERT OR IGNORE INTO messages(id,party_id,kind,due_at) VALUES(?,?,?,?)",p.id+':'+kind+':'+input.submissionId,p.id,kind+':'+input.submissionId,now)), ...(input.editKey?[query(env,'INSERT INTO state(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value','consent-draft:'+p.id+':'+await hash(input.editKey),JSON.stringify({data:text,savedAt:now,submitted:true,reference:input.submissionId}))]:[])]);
  return json({ success: true, reference: input.submissionId });
}
async function consentDraft(env,p,req){
  const secret=req.headers.get('X-Draft-Key')||'';
  if(!/^[a-f0-9]{64}$/.test(secret))fail('Invalid draft reference',403);
  const key='consent-draft:'+p.id+':'+await hash(secret);
  if(Date.now()>finish(p)+DAY)fail('This party has finished.',409);
  if(req.method==='GET'){
    const row=await read(env,'SELECT value FROM state WHERE key=?',key);
    return json({draft:row?JSON.parse(row.value):null});
  }
  const input=await body(req),allowed=['participantName','participantDob','contactEmail','contactPhone','participantSignature','guardianName','guardianSignature'];
  const data={};for(const k of allowed){if(input[k]!==undefined){if(typeof input[k]!=='string'||input[k].length>200)fail('Please check your draft entries.');data[k]=input[k];}}
  const draft={data,savedAt:Date.now()};
  await query(env,'INSERT INTO state(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',key,JSON.stringify(draft)).run();
  return json({saved:true,submitted:false});
}
async function staffAction(env, input) {
  const p = await read(env, "SELECT * FROM parties WHERE id=?", input.id);
  if (!p) fail("Party not found", 404);
  if (input.revision !== p.updated_at) fail("The booking has changed. Please refresh it before making a decision.", 409);
  const now = Math.max(Date.now(), p.updated_at + 1);
  if (input.action === "pause" || input.action === "cancel") {
    await env.DB.batch([query(env, "UPDATE parties SET status=?,updated_at=? WHERE id=? AND updated_at=?", input.action === "cancel" ? "cancelled" : "review", now, p.id, p.updated_at), query(env, "UPDATE messages SET status='skipped' WHERE party_id=? AND status='pending'", p.id), query(env, "INSERT INTO events(party_id,action,at,detail) VALUES(?,?,?,?)", p.id, input.action, now, "Staff action")]);
  } else if (["approve", "decline"].includes(input.action) && ["time", "theme"].includes(input.extra)) {
    const extras = JSON.parse(p.extras || "{}");
    if (!extras[input.extra]) fail("No matching extra request");
    extras[input.extra].status = input.action === "approve" ? "approved" : "declined";
    extras[input.extra].note = String(input.note || "").trim().slice(0, 300);
    const r = await env.DB.batch([query(env, "UPDATE parties SET extras=?,updated_at=? WHERE id=? AND updated_at=?", JSON.stringify(extras), now, p.id, p.updated_at), query(env, "INSERT OR IGNORE INTO messages(id,party_id,kind,due_at) SELECT ?,?,'extras',? WHERE EXISTS(SELECT 1 FROM parties WHERE id=? AND updated_at=?)", `${p.id}:extras:${now}`, p.id, now, p.id, now), query(env, "INSERT INTO events(party_id,action,at,detail) VALUES(?,?,?,?)", p.id, input.action, now, JSON.stringify({ extra: input.extra, note: extras[input.extra].note }))]);
    if (!r[0].meta.changes) fail("Booking changed; refresh and try again", 409);
  } else if (input.action === "reconcile") {
    if (input.checkedInvoice !== true) fail("Check the current native Uplifter invoice before reconciling this record.");
    if (!PACKAGES[input.package] || !/^\S+@\S+\.\S+$/.test(input.email || "")) fail("Check the package and booking email.");
    const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(input.start || "");
    if (!match) fail("Enter the actual booked date and start time.");
    const hour = Number(match[2]);
    if (hour > 23) fail("Invalid start time");
    const start = torontoTime(match[1], `${hour % 12 || 12}:${match[3]} ${hour >= 12 ? "PM" : "AM"}`);
    if (start < Date.now()) fail("A past party cannot be enrolled in reminders.");
    const changedPackage = input.package !== p.package;
    const updated = { ...p, start_at: start, email: input.email.trim().toLowerCase(), package: input.package, updated_at: now, version: p.version + 1 };
    const resetExtras = start !== p.start_at || changedPackage;
    const extras = JSON.parse(p.extras || "{}");
    if (resetExtras) for (const [key,extra] of Object.entries(extras)) if(key!=='booking') extra.status = "pending";
    if(changedPackage)extras.booking={...extras.booking,config:packageConfig({...updated,extras:'{}'})};
    const statements = [query(env, "UPDATE parties SET status='active',start_at=?,email=?,package=?,version=?,details=?,extras=?,legacy=0,updated_at=? WHERE id=? AND updated_at=?", start, updated.email, updated.package, updated.version, changedPackage ? null : p.details, JSON.stringify(extras), now, p.id, p.updated_at), query(env, "UPDATE messages SET status='skipped' WHERE party_id=? AND status='pending'", p.id), query(env, "INSERT INTO events(party_id,action,at,detail) VALUES(?,'staff-reconciled',?,?)", p.id, now, JSON.stringify({ prior: { start: p.start_at, package: p.package, email: p.email, details: p.details }, next: { start, package: updated.package, email: updated.email }, nativeInvoiceChecked: true })), stmtMessage(env, `${p.id}:booking:${now}`, p.id, "booking", now), ...!p.details || changedPackage ? reminderSchedule(updated).filter((x) => x.at > now).map((x) => stmtMessage(env, `${p.id}:${x.kind}:${now}`, p.id, x.kind, x.at)) : [], stmtMessage(env, `${p.id}:waivers:${now}`, p.id, "waivers", Math.max(now, start - 2 * DAY))];
    const result = await env.DB.batch(statements);
    if (!result[0].meta.changes) fail("Booking changed; refresh before reconciling.", 409);
  } else fail("Unsupported action");
  return json({ saved: true });
}
async function ingest(env) {
  // Sweep the authenticated receipt history, including failed historical imports.
  // A policy cutover chooses terms; it must never exclude a paid future booking.
  const sweep=Number((await read(env,"SELECT value FROM state WHERE key='receipt_sweep_offset'"))?.value||1);
  let nextOffset=1;
  let count=0, retryNeeded=false;
  for(const start of [...new Set([1,sweep])]){
    const qs=new URLSearchParams({searchKey:`sender:no-reply@leapgymnastics.uplifterinc.com::entire:birthday`,limit:'100',start:String(start)});
    const list=await zoho(env,`/accounts/${env.ZOHO_ACCOUNT_ID}/messages/search?${qs}`);
    for(const msg of [...list||[]].reverse()){
      const mid=String(msg.messageId),received=Number(msg.receivedTime);
      const processed=await read(env,'SELECT result FROM source_messages WHERE id=?',mid);
      const invoice=/\bInvoice\s*#0*(\d+)\b/i.exec(msg.subject||'')?.[1];
      const pending=invoice?await read(env,"SELECT id FROM parties WHERE invoice=? AND json_extract(extras,'$.booking.billing.verificationPending')=1",invoice):null;
      if(!pending&&processed&&['Matched birthday booking','Duplicate booking notification','Past party; no catch-up email','Cancelled booking preserved','Not a birthday booking'].includes(processed.result))continue;
      if(msg.fromAddress?.toLowerCase()!=='no-reply@leapgymnastics.uplifterinc.com')continue;
      const base=`/accounts/${env.ZOHO_ACCOUNT_ID}/folders/${msg.folderId}/messages/${mid}`;
      const headers=await zoho(env,base+'/header?raw=false');
      if(!trusted(headers.headerContent||{})){
        await query(env,'INSERT OR IGNORE INTO source_messages VALUES(?,?,?)',mid,received,'Untrusted sender authentication; ignored').run();continue;
      }
      let parsed,deposit;
      try{
        const known=invoice?(await read(env,'SELECT * FROM parties WHERE invoice=?',invoice)|| (env.LEGACY_DB?await env.LEGACY_DB.prepare('SELECT * FROM parties WHERE invoice=?').bind(invoice).first():null)):null;
        const content=await zoho(env,base+'/content');
        if(isPastBirthdayReceipt(content.content)){
          await query(env,"INSERT INTO source_messages VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET result=excluded.result",mid,received,'Past party; no catch-up email').run();
          await query(env,'DELETE FROM state WHERE key=?','intake-error:'+mid).run();
          continue;
        }
        const lines=invoiceLines(content.content),categories=lines.flatMap((line,i)=>line==='Category'?[lines[i+1]]:[]);
        const hasParty=lines.some(line=>/^Birthday Parties\s*[-\u2013\u2014]\s*[A-Za-z]+\s+\d{4}/.test(line));
        // The global native receipt footer mentions birthday forms on other
        // program invoices too. Classify their registration items, not footer text.
        if(!known&&!hasParty&&categories.length&&categories.every(name=>name!=='Birthday Parties')){
          await query(env,"INSERT INTO source_messages VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET result=excluded.result",mid,received,'Not a birthday booking').run();
          await query(env,'DELETE FROM state WHERE key=?','intake-error:'+mid).run();
          continue;
        }
        parsed=parseBookings(msg,content.content,known?[{...known,confirmed_price:packageConfig(known)?.price}]:[]);
        deposit=verifiedDeposit(content.content,parsed);
        await query(env,'DELETE FROM state WHERE key=?','intake-error:'+mid).run();
      }
      catch(error){
        // An unreadable notification is not evidence that a paid booking is invalid.
        // Leave its form and messages available, and retain the failure for retry.
        await query(env,"INSERT INTO state(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",'intake-error:'+mid,JSON.stringify({received,invoice,error:String(error.message).slice(0,200)})).run();
        retryNeeded=true;continue;
      }
      const statements=[],outcomes=[];let added=0;
      const nativeCutover=Number(env.NATIVE_INVOICE_CUTOVER_MS||0);
      for(const item of parsed){
        if(nativeCutover>0&&item.booked_at<nativeCutover){outcomes.push('Earlier booking; no new emails');continue;}
        if(item.start_at<=Date.now()){outcomes.push('Past party; no catch-up email');continue;}
        const old=await read(env,'SELECT * FROM parties WHERE invoice=?',item.invoice) || (env.LEGACY_DB ? await env.LEGACY_DB.prepare('SELECT * FROM parties WHERE invoice=?').bind(item.invoice).first():null);
        if(old){
          if(old.status==='cancelled'){outcomes.push('Cancelled booking preserved');continue;}
          const changed=['start_at','package','email'].some(k=>old[k]!==item[k]) || (item.package!=='Pending'&&item.package_price!==packageConfig(old)?.price);
          outcomes.push(changed?'Booking changed; staff reconciliation required':'Duplicate booking notification');
          if(changed)statements.push(query(env,"INSERT INTO state(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",'booking-change:'+old.id,JSON.stringify({invoice:item.invoice,detectedAt:Date.now()})));
          if(!changed&&old.status==='review'){
            const db=(await read(env,'SELECT id FROM parties WHERE id=?',old.id))?env.DB:env.LEGACY_DB;
            await db.batch([
              db.prepare("UPDATE parties SET status='active',updated_at=? WHERE id=? AND status='review'").bind(Date.now(),old.id),
              db.prepare("INSERT OR IGNORE INTO messages(id,party_id,kind,due_at) VALUES(?,?,'link',?)").bind(old.id+':verified-recovery',old.id,Date.now())
            ]);
          }
          if(!changed&&deposit&&JSON.parse(old.extras||'{}').booking?.billing?.verificationPending){
            const extras=JSON.parse(old.extras);extras.booking.billing={...extras.booking.billing,...deposit,verificationPending:false};
            statements.push(query(env,'UPDATE parties SET extras=? WHERE id=?',JSON.stringify(extras),old.id));
          }
          continue;
        }
        const config={...packageConfig(item),price:item.package_price};
        if(!Number.isFinite(config.price)||config.price<=0)throw Error('Receipt price could not be read');
        const invoicePolicy=env.INVOICE_MODE==='live'&&Number(env.INVOICE_CUTOVER_MS)>0&&item.booked_at>=Number(env.INVOICE_CUTOVER_MS);
        const p={...item,id:random(),version:1,updated_at:Date.now(),extras:JSON.stringify({booking:{config,...invoicePolicy?{billing:{policy:POLICY,...deposit,...!deposit?{verificationPending:true}:{}}}:{}}})};
        statements.push(query(env,'INSERT OR IGNORE INTO parties(id,invoice,email,start_at,booked_at,package,child_name,updated_at,source_message,extras) VALUES(?,?,?,?,?,?,?,?,?,?)',p.id,p.invoice,p.email,p.start_at,p.booked_at,p.package,p.child_name,p.updated_at,mid,p.extras),...(!nativeCutover?[stmtMessage(env,`${p.id}:booking`,p.id,'booking',Date.now())]:[]),...reminderSchedule(p).filter(x=>x.at>Date.now()).map(x=>stmtMessage(env,`${p.id}:${x.kind}`,p.id,x.kind,x.at)),stmtMessage(env,`${p.id}:waivers`,p.id,'waivers',Math.max(Date.now(),p.start_at-2*DAY)));
        outcomes.push('Matched birthday booking');added++;
      }
      const problem=outcomes.find(x=>!['Matched birthday booking','Duplicate booking notification','Legacy booking: not enrolled','Earlier booking; no new emails'].includes(x));
      const result=problem || (added?'Matched birthday booking':outcomes.includes('Duplicate booking notification')?'Duplicate booking notification':'Past party; no catch-up email');
      statements.push(query(env,'INSERT INTO source_messages VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET result=excluded.result',mid,received,result));
      await env.DB.batch(statements);count+=added;
      if(env.LEGACY_DB&&['Matched birthday booking','Duplicate booking notification','Past party; no catch-up email','Cancelled booking preserved'].includes(result)){
        await env.LEGACY_DB.prepare('UPDATE source_messages SET result=? WHERE id=?').bind(result,mid).run();
      }
    }
    if(start===sweep)nextOffset=list?.length===100?start+100:1;
  }
  await query(env,"INSERT INTO state(key,value) VALUES('receipt_sweep_offset',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",String(nextOffset)).run();
  if(!retryNeeded)await query(env,"INSERT INTO state(key,value) VALUES('last_ingest',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",String(Date.now())).run();
  return {matched:count,retryNeeded};
}
const deliver=deliverQueue;
async function retryInvoicePreparation(env){
  const pending=await all(env,"SELECT key FROM state WHERE key LIKE 'invoice-retry:%'");
  for(const item of pending){
    const p=await read(env,"SELECT * FROM parties WHERE id=? AND status='active'",item.key.slice('invoice-retry:'.length));
    if(!p?.details||p.start_at<=Date.now())continue;
    try{
      const statement=await queueInvoice(env,p,JSON.parse(p.details),Date.now(),p.updated_at);
      if(statement)await statement.run();
      await query(env,'DELETE FROM state WHERE key=?',item.key).run();
    }catch{ /* Keep retrying independently; the parent form remains available. */ }
  }
}
async function alertStaff(env) {
  const exceptions=await all(env,"SELECT id,result FROM source_messages WHERE result NOT IN ('Matched birthday booking','Duplicate booking notification','Legacy booking: not enrolled','Past party; no catch-up email','Cancelled booking preserved','Not a birthday booking') ORDER BY received_at DESC LIMIT 100");
  const uncertain=await all(env,"SELECT id,status FROM messages WHERE status IN ('uncertain','sending','render-error') ORDER BY due_at DESC LIMIT 100");
  const invoiceIssues=env.INVOICE_MODE==='live'?await all(env,"SELECT party_id,status,error FROM party_invoices WHERE status IN ('uncertain','sending','render-error') ORDER BY updated_at DESC LIMIT 100"):[];
  if(!exceptions.length&&!uncertain.length&&!invoiceIssues.length)return;
  const fingerprint=await hash(JSON.stringify([exceptions,uncertain,invoiceIssues]));
  const previous=await read(env,"SELECT value FROM state WHERE key='alert_digest'");
  if(previous?.value===fingerprint)return;
  await send(env,"info@leapgymnastics.ca","Birthday booking needs attention",`<p>Please check birthday preparation. ${exceptions.length} booking notification(s), ${uncertain.length} email delivery result(s) and ${invoiceIssues.length} invoice result(s) need checking.</p><p><a href="${e(env.PUBLIC_ORIGIN)}/staff/">Open birthday preparation</a></p><p>Check the Sent folder and Zoho Invoice before resending anything whose delivery is uncertain.</p>`);
  await query(env,"INSERT INTO state(key,value) VALUES('alert_digest',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",fingerprint).run();
}
async function tick(env) {
  const now = Date.now();
  const lock = await query(env, "INSERT INTO state(key,value) VALUES('tick_lock',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value WHERE CAST(state.value AS INTEGER)<?", String(now + 24e4), now).run();
  if (!lock.meta.changes) return { busy: true };
  try {
    if((await read(env,"SELECT value FROM state WHERE key='automation_paused'"))?.value==='1')return {paused:true};
    const errors=[];
    const stage=async(name,fn)=>{try{return await fn();}catch{errors.push(name);return {failed:true};}};
    const imported=await stage('booking-import',()=>ingest(env));
    if(imported.retryNeeded)errors.push('booking-import-retrying');
    await stage('invoice-preparation',()=>retryInvoicePreparation(env));
    const invoices=await stage('invoices',()=>deliverInvoices(env));
    const mail=await stage('emails',()=>deliver(env));
    let previousWorkflow;
    if(env.LEGACY_DB){
      const legacy={...env,LEGACY_DELIVERY:true,DB:env.LEGACY_DB,INVOICE_MODE:'disabled',PUBLIC_ORIGIN:env.LEGACY_ORIGIN,GUEST_ORIGIN:'https://leap-participant-consent-form.pages.dev'};
      previousWorkflow=await stage('existing-booking-emails',()=>deliver(legacy));
      await stage('existing-booking-alerts',()=>alertStaff(legacy));
    }
    await stage('staff-alerts',()=>alertStaff(env));
    await query(env,"INSERT INTO state(key,value) VALUES('last_tick_errors',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",JSON.stringify(errors)).run();
    if(!errors.length)await query(env,"INSERT INTO state(key,value) VALUES('last_tick_ok',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",String(Date.now())).run();
    return { ...imported, ...invoices, ...mail, previousWorkflow, errors };
  } finally {
    await query(env, "UPDATE state SET value='0' WHERE key='tick_lock'").run();
  }
}
async function route(req, env, ctx) {
  const u = new URL(req.url), path = u.pathname;
  if (path === "/internal/tick") {
    if (!equal(bearer(req), env.TICK_SECRET)) fail("Not found", 404);
    return json(await tick(env));
  }
  if(path==='/internal/health'){
    if(!equal(bearer(req),env.TICK_SECRET))fail('Not found',404);
    const accounts=await zoho(env,'/accounts');
    const mailbox=accounts.some(a=>a.primaryEmailAddress==='info@leapgymnastics.ca'&&String(a.accountId)===env.ZOHO_ACCOUNT_ID);
    let invoiceOrganizationVerified=false;
    if(env.INVOICE_CLIENT_ID&&env.INVOICE_ORGANIZATION_ID){const result=await invoiceApi(env,'/organizations');invoiceOrganizationVerified=result.organizations.some(o=>String(o.organization_id)===env.INVOICE_ORGANIZATION_ID&&o.currency_code==='CAD');}
    return json({mailboxVerified:mailbox,mailMode:env.MAIL_MODE,invoiceMode:env.INVOICE_MODE||'disabled',invoiceOrganizationVerified,invoiceCutover:Number(env.INVOICE_CUTOVER_MS||0),cutover:Number(env.CUTOVER_MS),lastIngest:await read(env,"SELECT value FROM state WHERE key='last_ingest'"),lastCompletedRun:await read(env,"SELECT value FROM state WHERE key='last_tick_ok'"),lastRunErrors:await read(env,"SELECT value FROM state WHERE key='last_tick_errors'"),overdueEmailCount:await read(env,"SELECT COUNT(*) n FROM messages WHERE status='pending' AND due_at<?",Date.now())});
  }
  if (path.startsWith("/api/")) {
    const origin = req.headers.get("Origin");
    if (origin && ![u.origin, env.PUBLIC_ORIGIN, "https://leap-participant-consent-form.pages.dev"].includes(origin)) fail("Origin not allowed", 403);
    if(path.startsWith('/api/portal/')){
      const response=await portal(req,env,req.method==='POST'?await body(req):{}, {bookings:async email=>{
        const result=[],seen=new Set();
        for(const db of [env.DB,env.LEGACY_DB].filter(Boolean)){
          const records=(await db.prepare("SELECT * FROM parties WHERE email=? AND status='active' AND start_at>? ORDER BY start_at").bind(email,Date.now()-DAY).all()).results;
          for(const p of records){
            if(finish(p)<Date.now()||seen.has(p.invoice))continue;
            seen.add(p.invoice);
            const target=db===env.DB?env:{...env,PUBLIC_ORIGIN:env.LEGACY_ORIGIN,GUEST_ORIGIN:'https://leap-participant-consent-form.pages.dev'};
            result.push({date:formatDate(p.start_at),package:p.package,description:packageCopy(p),...await links(target,p)});
          }
        }
        return result;
      }});
      if(response)return response;
      fail('Not found',404);
    }
    if (path === '/api/find-link' && req.method === 'POST') {
      const input=await body(req),email=String(input.email||'').trim().toLowerCase();
      if(email.length>200||!/^\S+@\S+\.\S+$/.test(email))fail('Please enter the email used for your booking.');
      const now=Date.now(),bucket=Math.floor(now/300000),key=await hash('find-link:'+email+':'+bucket);
      const limited=await query(env,"INSERT OR IGNORE INTO sessions(token_hash,kind,expires_at) VALUES(?,'rate',?)",key,now+300000).run();
      if(limited.meta.changes){
        for(const db of [env.DB,env.LEGACY_DB].filter(Boolean)){
          const found=(await db.prepare("SELECT * FROM parties WHERE email=? AND status='active' AND start_at>?").bind(email,now-DAY).all()).results.filter(p=>p.start_at>now||finish(p)>now);
          if(found.length)await db.batch(found.map(p=>db.prepare("INSERT OR IGNORE INTO messages(id,party_id,kind,due_at) VALUES(?,?,'link',?)").bind(`${p.id}:requested-link:${bucket}`,p.id,now)));
        }
        if(ctx?.waitUntil)ctx.waitUntil((async()=>{
          await deliver(env);
          if(env.LEGACY_DB)await deliver({...env,LEGACY_DELIVERY:true,DB:env.LEGACY_DB,INVOICE_MODE:'disabled',PUBLIC_ORIGIN:env.LEGACY_ORIGIN,GUEST_ORIGIN:'https://leap-participant-consent-form.pages.dev'});
        })());
      }
      return json({accepted:true});
    }
    if (path === "/api/party") {
      const p = await party(env, req);
      return req.method === "GET" ? json(await view(env, p,true)) : req.method === "POST" ? saveDetails(env, p, await body(req),ctx) : json({}, 405);
    }
    if (path === "/api/guest" && req.method === "GET") {
      const p = await party(env, req, "guest");
      return json({ id: p.id, child_name: p.child_name, start_at: p.start_at, title: `Leap birthday party on ${formatDate(p.start_at)}` });
    }
    if (path === "/api/waivers" && req.method === "POST") return saveWaiver(env, await party(env, req, "guest"), await body(req), req);
    if(path==='/api/consent-draft'&&['GET','POST'].includes(req.method))return consentDraft(env,await party(env,req,'guest'),req);
    if (path === "/api/staff/login" && req.method === "POST") return login(env, req);
    if (path === "/api/staff/exchange" && req.method === "POST") return exchange(env, await body(req));
    if (path.startsWith("/api/staff/")) {
      await staff(env, req);
      if (path === "/api/staff/parties" && req.method === "GET") {
        const parties = await all(env, "SELECT * FROM parties WHERE start_at>? ORDER BY start_at LIMIT 150", Date.now() - 14 * DAY);
        return json({ automationEnabled: (await read(env,"SELECT value FROM state WHERE key='automation_paused'"))?.value !== '1', parties: await Promise.all(parties.map(async (p) => ({ ...await view(env, p), email: p.email, status: p.status, legacy: !!p.legacy }))), exceptions: await all(env, "SELECT id,received_at,result FROM source_messages WHERE result NOT IN ('Matched birthday booking','Duplicate booking notification','Legacy booking: not enrolled','Past party; no catch-up email','Cancelled booking preserved','Not a birthday booking') ORDER BY received_at DESC LIMIT 50"), mail: await all(env, "SELECT id,party_id,kind,status,error FROM messages WHERE status IN ('uncertain','sending','render-error') ORDER BY due_at DESC LIMIT 50"), lastIngest: await read(env, "SELECT value FROM state WHERE key='last_ingest'") });
      }
      if (path === "/api/staff/action" && req.method === "POST") return staffAction(env, await body(req));
      if(path==='/api/staff/automation'&&req.method==='POST'){
        const input=await body(req);if(typeof input.enabled!=='boolean')fail('Choose whether to enable birthday emails.');
        await query(env,"INSERT INTO state(key,value) VALUES('automation_paused',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",input.enabled?'0':'1').run();
        return json({enabled:input.enabled});
      }
      if (path === '/api/staff/waivers' && req.method === 'GET') {
        const id=u.searchParams.get('party');
        const records=await all(env,'SELECT id,child_name,parent_name,submitted_at,legal_version,payload FROM waivers WHERE party_id=? ORDER BY submitted_at',id);
        return json({records:records.map(r=>({...r,payload:JSON.parse(r.payload)}))});
      }
    }
    fail("Not found", 404);
  }
  const target = new URL(req.url);
  if(path==='/')target.pathname='/entry.html';
  if(path==='/existing-bookings/')target.pathname='/index.html';
  if (['/party','/party/'].includes(path)) target.pathname='/party.html';
  if (['/staff','/staff/'].includes(path)) target.pathname='/staff.html';
  let response = await env.ASSETS.fetch(new Request(target, req));
  // Pages canonicalizes .html assets. Resolve those redirects inside the asset
  // service so the legacy index cannot be routed back through the new entry page.
  for(let count=0;count<3&&response.status>=300&&response.status<400&&response.headers.get('Location');count++){
    const location=new URL(response.headers.get('Location'),target);
    if(location.origin!==u.origin)break;
    response=await env.ASSETS.fetch(new Request(location,req));
  }
  const headers = new Headers(response.headers);
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Content-Type-Options", "nosniff");
  if (['/party','/party/','/staff','/staff/','/'].includes(path)) {
    headers.set("Cache-Control", "no-store");
    headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://www.leapgymnastics.ca; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  }
  return new Response(response.body, { status: response.status, headers });
}
export default { async scheduled(event,env,ctx) {ctx.waitUntil(tick(env));}, async fetch(req, env, ctx) {
  const origin = req.headers.get("Origin"), allowed = origin === "https://leap-participant-consent-form.pages.dev";
  let response;
  if (req.method === "OPTIONS" && allowed) response = new Response(null, { status: 204 });
  else try {
    response = await route(req, env, ctx);
  } catch (error) {
    response = json({ error: error.status ? error.message : "We could not complete this request. Your answers have not been cleared. Please try again." }, error.status || 500);
  }
  if (allowed) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Draft-Key");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.append("Vary", "Origin");
  }
  return response;
} };
