import { escape as e } from "./security.js";
import { formatDate } from "./domain.js";
const $ = (s) => document.querySelector(s);
let auth = sessionStorage.getItem("leap-birthday-staff") || "", parties = [];
async function api(path, data) {
  const r = await fetch("/api/staff/" + path, { method: data ? "POST" : "GET", headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth }, body: data ? JSON.stringify(data) : void 0, signal: AbortSignal.timeout(3e4) });
  const j = await r.json();
  if (!r.ok) throw Error(j.error || "Request failed");
  return j;
}
async function load() {
  const data = await api("parties");
  parties = data.parties;
  $("#workspace").hidden = false;
  $("#login").hidden = true;
  let control = $('#automationControl');
  if (!control) {
    control = document.createElement('label'); control.id = 'automationControl'; control.className = 'check';
    control.innerHTML = '<input type="checkbox" id="automationEnabled">Automatic birthday emails enabled';
    $('#sync').before(control);
    $('#automationEnabled').onchange = async event => {
      const input = event.target; input.disabled = true;
      try { await api('automation', {enabled: input.checked}); $('#notice').textContent = input.checked ? 'Automatic birthday emails enabled.' : 'Automatic birthday emails paused. Submitted details and waivers are still saved.'; }
      catch (error) { input.checked = !input.checked; $('#notice').textContent = error.message; }
      finally { input.disabled = false; }
    };
  }
  $('#automationEnabled').checked = data.automationEnabled;
  $("#sync").textContent = data.lastIngest ? "Last booking check: " + formatDate(Number(data.lastIngest.value)) : "Booking connection has not yet run.";
  $("#exceptions").innerHTML = data.exceptions.length || data.mail.length ? `<section><h2>Needs attention</h2><ul>${data.exceptions.map((x) => `<li>${e(formatDate(x.received_at))}: ${e(x.result)}. Message reference ${e(x.id)}.</li>`).join("")}${data.mail.map((x) => `<li>${e(x.kind)}: ${e(x.error || x.status)}. Party ${e(x.party_id)}.</li>`).join("")}</ul></section>` : "";
  $("#parties").innerHTML = parties.length ? parties.map((p) => {
    const d = p.details;
    return `<details class="staff-row" data-id="${p.id}"><summary>${e(formatDate(p.start_at))} | ${e(d?.childName || "Party details needed")} | ${e(p.package)} <span class="status">${e(p.status)} / ${d ? "details received" : "details missing"}</span></summary><div class="prep"><p>Invoice ${e(p.invoice)}. Finish: <strong>${e(formatDate(p.finish_at))}</strong>. Details due: ${e(formatDate(p.deadline))}.</p><p>${e(p.packageCopy)}</p>${d ? `<dl><dt>Children / adults</dt><dd>${e(d.children)} / ${e(d.adults)}</dd><dt>Age / age range</dt><dd>${e(d.childAge)} / ${e(d.ageRange)}</dd><dt>Party-day phone</dt><dd>${e(d.phone)}</dd><dt>Balloon colours</dt><dd>${e(d.colours.join(", ") || "None included")}</dd><dt>Mini Party Favour Bags</dt><dd>${e(d.loot)}</dd><dt>Beverage station</dt><dd>${p.package === "Deluxe" || d.beverages ? "Yes" : "No"}</dd><dt>Independent participation</dt><dd>${e(d.independent)}</dd><dt>Support information</dt><dd>${e(d.support || "None supplied")}</dd></dl>` : "<p>Party details have not been submitted.</p>"}<h3>Optional requests</h3>${Object.entries(p.extras).filter(([k])=>k!=="booking").map(([k, x]) => `<p>${e(x.label)}: <strong>${e(x.status)}</strong></p>${x.status === "pending" ? `<div class="actions"><button data-action="approve" data-extra="${k}">Approve</button><button class="secondary" data-action="decline" data-extra="${k}">Decline</button></div>` : ""}`).join("") || "<p>No availability-dependent extras requested.</p>"}<h3>Waivers</h3><ul>${p.waivers.map((w) => `<li>${e(w.name)}: ${{ received: "received", needed: "still needed", check: "check duplicate or uncertain name" }[w.status]}</li>`).join("")}</ul>${p.waivers.length ? "" : `<p>${p.waiversReceived} received. No expected guest list has been supplied.</p>`}<h3>Party-day routine</h3><ol><li>Prepare the standard ${e(p.package)} setup, included supplies and confirmed extras before arrival.</li><li>Confirm the hosting adult, actual participating children, waivers and food-serving responsibilities.</li><li>Gym activities: ${e(p.config.gym)} minutes. Celebration follows for ${e(p.config.celebration)} minutes, with no additional time.</li><li>Give the hosting adult a friendly packing reminder 15 minutes before the confirmed finish.</li><li>Record actual attendance and approved extras for the e-transfer balance. Do not assume late charges or tax calculations.</li></ol><div class="actions"><button data-action="pause" class="secondary">Pause automation for review</button><button data-action="cancel" class="secondary">Mark cancelled</button></div></div></details>`;
  }).join("") : "<p>No connected birthday bookings yet. Existing bookings are not automatically enrolled.</p>";
  for (const p of parties.filter(p => p.status !== 'active')) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'secondary'; button.dataset.action = 'reconcile';
    button.textContent = 'Reconcile checked Uplifter booking';
    document.querySelector(`[data-id="${p.id}"] .prep`).append(button);
  }
  for (const p of parties) {
    const button=document.createElement('button');button.type='button';button.className='secondary';button.dataset.action='waivers';button.textContent='Download signed waiver records';
    document.querySelector(`[data-id="${p.id}"] .prep`).append(button);
  }
}
$("#signIn").onclick = async () => {
  try {
    $("#signIn").disabled = true;
    await api("login", {});
    $("#notice").textContent = "Check info@leapgymnastics.ca for your sign-in link.";
  } catch (err) {
    $("#notice").textContent = err.message;
  } finally {
    $("#signIn").disabled = false;
  }
};
$("#refresh").onclick = () => load().catch((err) => $("#notice").textContent = err.message);
$("#print").onclick = () => window.print();
$("#signOut").onclick = () => {
  sessionStorage.removeItem("leap-birthday-staff");
  location.reload();
};
$("#parties").onclick = async (event) => {
  const b = event.target.closest("button[data-action]");
  if (!b) return;
  const p = parties.find((p2) => p2.id === b.closest("[data-id]").dataset.id);
  if(b.dataset.action==='waivers'){
    b.disabled=true;
    try{const data=await api('waivers?party='+p.id);const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='leap-invoice-'+p.invoice+'-signed-waivers.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
    catch(error){$('#notice').textContent=error.message;}finally{b.disabled=false;}return;
  }
  if (b.dataset.action === 'reconcile') {
    const form = $('#reconcileForm'); form.dataset.id = p.id;
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(p.start_at).map(x=>[x.type,x.value]));
    form.elements.start.value = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
    form.elements.package.value = p.package; form.elements.email.value = p.email;
    form.elements.checkedInvoice.checked = false; $('#reconcileInvoice').textContent = 'Invoice '+p.invoice;
    $('#reconcileDialog').showModal(); return;
  }
  if (!confirm(`${b.textContent} for invoice ${p.invoice}?`)) return;
  b.disabled = true;
  try {
    await api("action", { id: p.id, revision: p.updated_at, action: b.dataset.action, extra: b.dataset.extra });
    await load();
    $("#notice").textContent = "Saved. Any parent update has been queued.";
  } catch (err) {
    $("#notice").textContent = err.message;
    b.disabled = false;
  }
};
$('#closeReconcile').onclick=()=>$('#reconcileDialog').close();
$('#reconcileForm').onsubmit=async event=>{
  event.preventDefault();const form=event.currentTarget,p=parties.find(p=>p.id===form.dataset.id);
  const button=form.querySelector('[type=submit]');button.disabled=true;
  try {await api('action',{action:'reconcile',id:p.id,revision:p.updated_at,start:form.elements.start.value,package:form.elements.package.value,email:form.elements.email.value,checkedInvoice:form.elements.checkedInvoice.checked});$('#reconcileDialog').close();await load();$('#notice').textContent='Booking reconciled. The updated parent link has been queued.';}
  catch(error){$('#reconcileInvoice').textContent=error.message;}
  finally {button.disabled=false;}
};
try {
  const login = new URLSearchParams(location.hash.slice(1)).get("login");
  if (login) {
    history.replaceState(null, "", location.pathname);
    const j = await api("exchange", { token: login });
    auth = j.token;
    sessionStorage.setItem("leap-birthday-staff", auth);
  }
  if (auth) await load();
} catch (err) {
  $("#notice").textContent = err.message;
  sessionStorage.removeItem("leap-birthday-staff");
}
