import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs/promises';
import worker from '../cloudflare-pages/birthday-qc-20261016/entry-worker.js';
import {token,hash} from '../cloudflare-pages/birthday-qc-20261016/security.js';
import {torontoTime,packageConfig} from '../cloudflare-pages/birthday-qc-20261016/domain.js';
import {emailFor} from '../cloudflare-pages/birthday-qc-20261016/emails.js';
import {parseBooking,parseBookings,isPastBirthdayReceipt} from '../cloudflare-pages/birthday-qc-20261016/booking.js';
import {POLICY} from '../cloudflare-pages/birthday-qc-20261016/billing.js';
import {formHtml} from '../cloudflare-pages/birthday-qc-20261016/presentation.js';
const db=new DatabaseSync(':memory:');db.exec(await fs.readFile(process.env.LEAP_WORKSPACE+'/cloudflare-pages/birthday-qc-20261016/schema.sql','utf8'));
const DB={prepare(sql){return {args:[],bind(...a){this.args=a;return this;},async first(){return db.prepare(sql).get(...this.args)||null;},async all(){return {results:db.prepare(sql).all(...this.args)};},async run(){const r=db.prepare(sql).run(...this.args);return {meta:{changes:Number(r.changes)}};}};},async batch(list){db.exec('BEGIN');try{const r=[];for(const q of list)r.push(await q.run());db.exec('COMMIT');return r;}catch(e){db.exec('ROLLBACK');throw e;}}};
const now=torontoTime('2026-10-09','5:00 PM');Date.now=()=>now;
const env={DB,TOKEN_SECRET:'isolated-tests-only',TICK_SECRET:'isolated-tick',PUBLIC_ORIGIN:'https://birthday.example.invalid',MAIL_MODE:'test',CUTOVER_MS:String(torontoTime('2026-10-09','12:00 AM')),ZOHO_ACCOUNT_ID:'mock'};
const call=(path,key='',data)=>worker.fetch(new Request(env.PUBLIC_ORIGIN+path,{method:data?'POST':'GET',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined}),env);
let count=0;async function test(name,f){await f();console.log('PASS '+name);count++;}
const valid={childName:'Test Child',childAge:7,phone:'5550101000',children:10,ageRange:'6 to 8',independent:'Yes',support:'',colours:[],loot:0,beverages:false,food:['No food'],delivery:false,foodAdult:'',decor:'Use the included setup',roster:['Test Child'],agreements:{partyInformation:true,guestWaivers:true}};
await test('party date cannot be replaced by the deadline or duplicate the year',async()=>{
 const html=formHtml({package:'Basic',booked_at:now,start_at:torontoTime('2026-11-22','1:30 PM'),extras:'{}'});
 assert(html.includes('Sunday, November 22, 2026'));assert(html.includes('Sunday, November 15, 2026'));assert(!html.includes('2026, 2026'));
});
for(const pkg of ['Basic','Premium','Deluxe']){
 const p={id:crypto.randomUUID(),invoice:'TEST-'+pkg,email:'synthetic@example.invalid',start_at:torontoTime('2026-12-13','1:30 PM'),booked_at:now,package:pkg,version:1,updated_at:now};
 const config=packageConfig(p);p.extras=JSON.stringify({booking:{config}});
 db.prepare('INSERT INTO parties(id,invoice,email,start_at,booked_at,package,updated_at,source_message,extras) VALUES(?,?,?,?,?,?,?,?,?)').run(p.id,p.invoice,p.email,p.start_at,p.booked_at,p.package,now,'synthetic',p.extras);
 const host=await token(env.TOKEN_SECRET,'host',p),guest=await token(env.TOKEN_SECRET,'guest',p);
 await test(pkg+' confirmed package, dates and email',async()=>{const r=await call('/api/party?party='+p.id,host),v=await r.json();assert.equal(r.status,200);assert.equal(v.config.price,{Basic:399,Premium:589,Deluxe:849}[pkg]);assert.equal(v.finish_at-p.start_at,{Basic:105,Premium:120,Deluxe:135}[pkg]*60000);assert(!/November 29|November 22|Preview package/.test(v.formHtml));assert(v.formHtml.includes('Sunday, December 13, 2026'));const email=await emailFor(env,p,'booking');assert(!/sorry|earlier|current|new booking/i.test(email.content));assert(email.content.includes('#host='));assert(email.content.includes('#guest='));assert(email.content.includes('$'+config.price));});
 await test(pkg+' authorization and saved answers',async()=>{assert.equal((await call('/api/party?party='+p.id,guest)).status,403);const input={...valid,colours:pkg==='Basic'?[]:['Blue'],revision:now};const r=await call('/api/party?party='+p.id,host,input);assert.equal(r.status,200,await r.clone().text());const v=(await r.json()).party;assert.equal(v.details.childName,'Test Child');assert.equal(v.config.price,config.price);assert.equal((await call('/api/party?party='+p.id,host,input)).status,409);assert.equal((await (await call('/api/party?party='+p.id,host)).json()).details.phone,valid.phone);});
 await test(pkg+' invalid form cannot erase answers',async()=>{const v=await(await call('/api/party?party='+p.id,host)).json();assert.equal((await call('/api/party?party='+p.id,host,{...valid,children:99,revision:v.updated_at})).status,422);assert.equal(JSON.parse(db.prepare('SELECT details FROM parties WHERE id=?').get(p.id).details).childName,'Test Child');});
 if(pkg==='Basic')await test('guest waiver stored once and private fields excluded',async()=>{const input={participantName:'Test Child',participantDob:'2019-01-01',contactEmail:'guest-parent@example.invalid',contactPhone:'5550101000',participantSignature:'Test Child',guardianName:'Test Parent',guardianSignature:'Test Parent',ack12:true,ack34:true,ack57:true,electronicConsent:true,finalConfirmation:true,agreementVersion:'2026-2027',submissionId:crypto.randomUUID()};for(let n=0;n<2;n++)assert.equal((await call('/api/waivers?party='+p.id,guest,input)).status,200);const v=await(await call('/api/party?party='+p.id,host)).json();assert.equal(v.waiversReceived,1);assert.equal(db.prepare("SELECT count(*) n FROM messages WHERE kind LIKE 'consent-%'").get().n,2);assert.equal(v.waivers[0].status,'received');assert(!JSON.stringify(v).includes('2019-01-01'));});
}
await test('draft save is private, incomplete, silent and survives reload; submit notifies Leap each time',async()=>{
 const p=db.prepare("SELECT * FROM parties WHERE invoice='TEST-Basic'").get();const host=await token(env.TOKEN_SECRET,'host',p);
 const before=db.prepare('SELECT count(*) n FROM messages').get().n;
 let r=await call('/api/party?party='+p.id,host,{action:'save',revision:p.updated_at,childName:'Draft name'});
 assert.equal(r.status,200);let data=await r.json();assert.equal(data.submitted,false);assert.equal(data.party.draft.data.childName,'Draft name');
 assert.equal(db.prepare('SELECT count(*) n FROM messages').get().n,before);
 assert.equal(JSON.parse(db.prepare('SELECT details FROM parties WHERE id=?').get(p.id).details).childName,'Test Child');
 assert.equal((await(await call('/api/party?party='+p.id,host)).json()).draft.data.childName,'Draft name');
 const staffKey='test-staff-draft';db.prepare("INSERT INTO sessions(token_hash,kind,expires_at) VALUES(?,'staff',?)").run(await hash(staffKey),now+60000);
 const staff=await(await call('/api/staff/parties',staffKey)).json();assert(!JSON.stringify(staff).includes('Draft name'));
 for(let i=0;i<2;i++){
  const v=await(await call('/api/party?party='+p.id,host)).json();
  r=await call('/api/party?party='+p.id,host,{...valid,childName:'Submitted '+i,action:'submit',revision:v.updated_at});assert.equal(r.status,200);data=await r.json();assert.equal(data.party.draft,null);
 }
 assert.equal(db.prepare("SELECT count(*) n FROM messages WHERE party_id=? AND kind='staff-prep'").get(p.id).n,3);
});
await test('consent drafts are isolated and silent; submitted amendments notify both recipients and retain signed history',async()=>{
 const p=db.prepare("SELECT * FROM parties WHERE invoice='TEST-Basic'").get();const guest=await token(env.TOKEN_SECRET,'guest',p);const editKey='a'.repeat(64);
 const draft=async(method,key,data)=>worker.fetch(new Request(env.PUBLIC_ORIGIN+'/api/consent-draft?party='+p.id,{method,headers:{Authorization:'Bearer '+guest,'Content-Type':'application/json','X-Draft-Key':key},body:data?JSON.stringify(data):undefined}),env);
 const before=db.prepare('SELECT count(*) n FROM messages').get().n;
 assert.equal((await draft('POST',editKey,{participantName:'Unfinished consent'})).status,200);
 assert.equal((await(await draft('GET',editKey)).json()).draft.data.participantName,'Unfinished consent');
 assert.equal((await(await draft('GET','b'.repeat(64))).json()).draft,null);
 assert.equal(db.prepare('SELECT count(*) n FROM messages').get().n,before);
 const input={participantName:'Another Child',participantDob:'2019-01-01',contactEmail:'parent2@example.invalid',contactPhone:'5550101000',participantSignature:'Another Child',guardianName:'Test Parent',guardianSignature:'Test Parent',ack12:true,ack34:true,ack57:true,electronicConsent:true,finalConfirmation:true,agreementVersion:'2026-2027',submissionId:crypto.randomUUID(),editKey};
 assert.equal((await call('/api/waivers?party='+p.id,guest,input)).status,200);
 const amendment={...input,submissionId:crypto.randomUUID(),supersedes:input.submissionId,contactPhone:'5550101001'};
 assert.equal((await call('/api/waivers?party='+p.id,guest,{...amendment,editKey:'b'.repeat(64)})).status,403);
 assert.equal((await call('/api/waivers?party='+p.id,guest,amendment)).status,200);
 assert.equal((await call('/api/waivers?party='+p.id,guest,amendment)).status,200);
 assert.equal(db.prepare('SELECT count(*) n FROM messages').get().n,before+4);
 const host=await token(env.TOKEN_SECRET,'host',p);const v=await(await call('/api/party?party='+p.id,host)).json();assert.equal(v.waiversReceived,2);
 assert.equal(db.prepare('SELECT count(*) n FROM waivers WHERE id IN (?,?)').get(input.submissionId,amendment.submissionId).n,2);
});
const fixture=(date='Oct 9, 2026, 12:16 PM',price=399)=>`<div>synthetic@example.invalid</div><div>Registration Details</div><div>Test Child</div><div><b>Birthday Parties - December 2026 <span>[2026-12-20 1:30 PM]</span></b></div><div>Which birthday package would you like?</div><div>Basic Package - $${price} + HST - includes 10 participating children</div><div>Enrolled at</div><div>${date}</div><div>Payment Details</div><div>Paid</div>`;
await test('native package labels with and without Package are accepted without guessing missing answers',async()=>{
 for(const label of ['Deluxe - $849 + HST - 22 children','Premium Package - $589 + HST - 16 children','Basic Package - $399 + HST - 10 children']){
  const raw=fixture().replace('Basic Package - $399 + HST - includes 10 participating children',label);
  assert.equal(parseBookings({subject:'Invoice #9900'},raw)[0].package,label.split(' ')[0]);
 }
 assert.throws(()=>parseBookings({subject:'Invoice #9900'},fixture().replace('Basic Package - $399 + HST - includes 10 participating children','Something else')));
});
let incoming=[],bodies={},sends=[];
globalThis.fetch=async(url,options={})=>{const u=String(url);if(u.includes('/oauth/v2/token'))return Response.json({access_token:'test-token'});if(u.includes('/messages/search?'))return Response.json({data:typeof incoming==='function'?incoming(new URL(u)):incoming});if(u.includes('/header?'))return Response.json({data:{headerContent:{'Authentication-Results':['mx.zohomailcloud.ca; dkim=pass header.i=@leapgymnastics.uplifterinc.com; dmarc=pass header.from=leapgymnastics.uplifterinc.com;']}}});if(u.endsWith('/content'))return Response.json({data:{content:bodies[u.split('/').at(-2)]}});if(options.method==='POST'&&u.endsWith('/messages')){sends.push(JSON.parse(options.body));return Response.json({data:{messageId:'test-'+sends.length}});}throw Error('Unexpected network call');};
const msg=(id,invoice)=>({messageId:id,folderId:'test',receivedTime:String(now),subject:'Leap Gymnastics Invoice #'+invoice,fromAddress:'no-reply@leapgymnastics.uplifterinc.com'});
await test('older receipt without package question restores an exact existing booking without approving extras',async()=>{
 const raw=fixture().replace('<div>Which birthday package would you like?</div><div>Basic Package - $399 + HST - includes 10 participating children</div>','');
 const record={...parseBookings({subject:'Invoice #8999'},fixture())[0],id:crypto.randomUUID(),status:'review',version:1,updated_at:now,extras:JSON.stringify({time:{status:'pending',minutes:30}})};
 db.prepare('INSERT INTO parties(id,invoice,email,start_at,booked_at,package,status,updated_at,source_message,extras) VALUES(?,?,?,?,?,?,?,?,?,?)').run(record.id,record.invoice,record.email,record.start_at,record.booked_at,record.package,'review',now,'prior',record.extras);
 incoming=[msg('old-no-package','8999')];bodies['old-no-package']=raw;
 await call('/internal/tick',env.TICK_SECRET,{});
 const after=db.prepare('SELECT * FROM parties WHERE id=?').get(record.id);
 assert.equal(after.status,'active');assert.equal(JSON.parse(after.extras).time.status,'pending');assert.equal(after.version,1);
 assert.equal(db.prepare("SELECT count(*) n FROM messages WHERE id=?").get(record.id+':verified-recovery').n,1);
 assert.throws(()=>parseBookings({subject:'Invoice #8998'},raw,[{...record,confirmed_price:399}]));
});
await test('older paid future booking is recovered despite rollout cutoff',async()=>{incoming=[msg('old','9000')];bodies.old=fixture('Oct 8, 2026, 11:59 PM');assert.equal((await call('/internal/tick',env.TICK_SECRET,{})).status,200);assert.equal(db.prepare("SELECT COUNT(*) AS n FROM parties WHERE invoice='9000'").get().n,1);});
await test('new paid receipt creates one booking and one confirmation',async()=>{incoming=[msg('new','9001')];bodies.new=fixture();env.MAIL_MODE='live';const r=await call('/internal/tick',env.TICK_SECRET,{});assert.equal(r.status,200,await r.clone().text());const p=db.prepare("SELECT * FROM parties WHERE invoice='9001'").get();assert(p);assert.equal(JSON.parse(p.extras).booking.config.price,399);assert.equal(sends.filter(s=>s.toAddress==='synthetic@example.invalid'&&s.subject==='Your birthday party at Leap — Sunday, December 20, 2026'&&s.content.includes(p.id)).length,1);incoming=[msg('dup','9001')];bodies.dup=fixture();await call('/internal/tick',env.TICK_SECRET,{});assert.equal(db.prepare("SELECT COUNT(*) AS n FROM parties WHERE invoice='9001'").get().n,1);assert.equal(sends.filter(s=>s.subject==='Your birthday party at Leap — Sunday, December 20, 2026'&&s.content.includes(p.id)).length,1);});
await test('receipt price is preserved without excluding a valid booking',async()=>{incoming=[msg('price','9002')];bodies.price=fixture(undefined,450);await call('/internal/tick',env.TICK_SECRET,{});const p=db.prepare("SELECT * FROM parties WHERE invoice='9002'").get();assert.equal(p.status,'active');assert.equal(JSON.parse(p.extras).booking.config.price,450);});
await test('malformed notification is visible and alerts staff',async()=>{incoming=[msg('bad','9003')];bodies.bad='<p>Broken receipt</p>';const before=sends.length;await call('/internal/tick',env.TICK_SECRET,{});assert(db.prepare("SELECT value FROM state WHERE key='intake-error:bad'").get());assert.equal(db.prepare("SELECT id FROM source_messages WHERE id='bad'").get(),undefined);});
await test('host and consent resources resolve without exposing data',async()=>{for(const path of ['/','/party/','/party.js','/parent.css','/consent/','/consent/app.js','/consent/styles.css','/staff/'])assert.equal((await call(path)).status,200,path);assert.equal((await call('/api/staff/parties')).status,401);assert.equal((await call('/internal/tick')).status,404);});
await test('two birthday bookings on one receipt both receive the correct form once',async()=>{
 const one=fixture();const two=fixture().replace('2026-12-20','2026-12-27').replace('Basic Package - $399','Premium Package - $589');
 const receipt=one.split('<div>Payment Details</div>')[0]+two.split('<div>Registration Details</div>')[1];
 const parsed=parseBookings({subject:'Invoice #9020'},receipt);assert.equal(parsed.length,2);assert.deepEqual(parsed.map(p=>p.package),['Basic','Premium']);
 incoming=[msg('multiple','9020')];bodies.multiple=receipt;let r=await call('/internal/tick',env.TICK_SECRET,{});assert.equal(r.status,200);assert.equal(db.prepare("SELECT COUNT(*) AS n FROM parties WHERE invoice LIKE '9020:%'").get().n,2);
 const before=sends.length;incoming=[msg('multiple-duplicate','9020')];bodies['multiple-duplicate']=receipt;await call('/internal/tick',env.TICK_SECRET,{});assert.equal(sends.length,before);
 assert.throws(()=>parseBookings({subject:'Invoice #9021'},receipt.replaceAll('2026-12-27','2026-12-20')));
});
await test('historical catch-up continues to the next page automatically',async()=>{
 db.prepare("INSERT INTO state(key,value) VALUES('receipt_sweep_offset','1') ON CONFLICT(key) DO UPDATE SET value='1'").run();
 const page=Array.from({length:100},(_,i)=>({...msg('non-birthday-'+i,'0'),fromAddress:'other@example.invalid'}));
 incoming=u=>u.searchParams.get('start')==='1'?page:[msg('history-page-two','9030')];bodies['history-page-two']=fixture('Sep 30, 2026, 11:35 AM',350);
 await call('/internal/tick',env.TICK_SECRET,{});assert.equal(db.prepare("SELECT value FROM state WHERE key='receipt_sweep_offset'").get().value,'101');
 await call('/internal/tick',env.TICK_SECRET,{});assert.equal(db.prepare("SELECT status FROM parties WHERE invoice='9030'").get().status,'active');
 assert.equal(db.prepare("SELECT value FROM state WHERE key='receipt_sweep_offset'").get().value,'1');incoming=[];
});
await test('existing legacy booking is not duplicated in the newer database',async()=>{
 const existing={...parseBookings({subject:'Invoice #9040'},fixture())[0],id:crypto.randomUUID(),status:'active',extras:'{}',version:1,updated_at:now};
 env.LEGACY_DB={prepare(sql){return {args:[],bind(...args){this.args=args;return this;},async first(){return sql.includes('SELECT * FROM parties WHERE invoice=')&&this.args[0]==='9040'?existing:null;},async all(){return {results:[]};},async run(){return {meta:{changes:0}};}};}};
 env.LEGACY_ORIGIN='https://legacy.example.invalid';incoming=[msg('legacy-duplicate','9040')];bodies['legacy-duplicate']=fixture();
 try{await call('/internal/tick',env.TICK_SECRET,{});assert.equal(db.prepare("SELECT count(*) n FROM parties WHERE invoice='9040'").get().n,0);assert.equal(db.prepare("SELECT result FROM source_messages WHERE id='legacy-duplicate'").get().result,'Duplicate booking notification');}
 finally{delete env.LEGACY_DB;incoming=[];}
});
await test('native birthday footer on a class invoice does not create a party or a false failure',async()=>{
 incoming=[msg('ordinary-class','9050')];
 bodies['ordinary-class']=fixture().replace('Birthday Parties - December 2026','Ready Set Leap').replace('<div>Enrolled at</div>','<div>Category</div><div>School Year Recreational Programs</div><div>Enrolled at</div>')+'<h3>For birthday party bookings</h3><p>Get your party form link</p>';
 await call('/internal/tick',env.TICK_SECRET,{});
 assert.equal(db.prepare("SELECT count(*) n FROM parties WHERE invoice='9050'").get().n,0);
 assert.equal(db.prepare("SELECT result FROM source_messages WHERE id='ordinary-class'").get().result,'Not a birthday booking');
 assert.equal(db.prepare("SELECT value FROM state WHERE key='intake-error:ordinary-class'").get(),undefined);
 incoming=[];
});
await test('invoice verification cannot block form saving and preparation retries automatically',async()=>{
 const p=db.prepare("SELECT * FROM parties WHERE invoice='9001'").get();
 const extras=JSON.parse(p.extras);extras.booking.billing={policy:POLICY,verificationPending:true};
 db.prepare('UPDATE parties SET extras=? WHERE id=?').run(JSON.stringify(extras),p.id);
 const host=await token(env.TOKEN_SECRET,'host',p);
 const view=await(await call('/api/party?party='+p.id,host)).json();
 const input={...valid,revision:p.updated_at,agreements:Object.fromEntries(view.agreements.map(a=>[a.key,true]))};
 const saved=await call('/api/party?party='+p.id,host,input);assert.equal(saved.status,200,await saved.clone().text());
 assert(db.prepare('SELECT details FROM parties WHERE id=?').get(p.id).details);
 assert(db.prepare('SELECT value FROM state WHERE key=?').get('invoice-retry:'+p.id));
 extras.booking.billing={policy:POLICY,depositCents:11300,depositReference:'Synthetic receipt'};
 db.prepare('UPDATE parties SET extras=? WHERE id=?').run(JSON.stringify(extras),p.id);
 incoming=[];await call('/internal/tick',env.TICK_SECRET,{});
 assert.equal(db.prepare('SELECT status FROM party_invoices WHERE party_id=?').get(p.id).status,'pending');
 assert.equal(db.prepare('SELECT value FROM state WHERE key=?').get('invoice-retry:'+p.id),undefined);
});
await test('exact existing reservation with parent package selection remains active and is recognized',async()=>{
 const record={...parseBookings({subject:'Invoice #9100'},fixture())[0],id:crypto.randomUUID(),package:'Pending',status:'active',version:1,updated_at:now,extras:JSON.stringify({booking:{packageChoiceNeeded:true}})};
 db.prepare('INSERT INTO parties(id,invoice,email,start_at,booked_at,package,status,updated_at,source_message,extras) VALUES(?,?,?,?,?,?,?,?,?,?)').run(record.id,record.invoice,record.email,record.start_at,record.booked_at,record.package,'active',now,'prior-choice',record.extras);
 incoming=[msg('pending-package-receipt','9100')];bodies['pending-package-receipt']=fixture().replace('<div>Which birthday package would you like?</div><div>Basic Package - $399 + HST - includes 10 participating children</div>','');
 const r=await call('/internal/tick',env.TICK_SECRET,{}),result=await r.json();
 assert(!result.retryNeeded);assert(!result.errors.length);
 const after=db.prepare('SELECT * FROM parties WHERE id=?').get(record.id);assert.equal(after.status,'active');assert.equal(after.package,'Pending');assert.equal(after.extras,record.extras);assert.equal(after.version,1);
 assert.equal(db.prepare("SELECT result FROM source_messages WHERE id='pending-package-receipt'").get().result,'Duplicate booking notification');
 assert.equal(db.prepare("SELECT count(*) n FROM parties WHERE invoice='9100'").get().n,1);
 assert.throws(()=>parseBookings({subject:'Invoice #9101'},bodies['pending-package-receipt'],[{...record,confirmed_price:undefined}]));
});
await test('past receipts without package questions cannot stall future booking intake',async()=>{
 const past=fixture().replace('2026-12-20','2026-08-02').replace('<div>Which birthday package would you like?</div><div>Basic Package - $399 + HST - includes 10 participating children</div>','');
 incoming=[msg('past-no-package','9102')];bodies['past-no-package']=past;
 const result=await(await call('/internal/tick',env.TICK_SECRET,{})).json();assert(!result.retryNeeded);assert(!result.errors.length);
 assert.equal(db.prepare("SELECT result FROM source_messages WHERE id='past-no-package'").get().result,'Past party; no catch-up email');
 assert(!db.prepare("SELECT id FROM parties WHERE invoice='9102'").get());
 assert(!isPastBirthdayReceipt(past+fixture()));assert(!isPastBirthdayReceipt(past.replace('[2026-08-02 1:30 PM]','')));assert(!isPastBirthdayReceipt(fixture()));
});
await test('saved form sends separate parent and Leap notifications with correct private links',async()=>{
 const {deliverQueue}=await import('../cloudflare-pages/birthday-qc-20261016/delivery.js');
 const p=db.prepare("SELECT * FROM parties WHERE invoice='TEST-Basic'").get();
 const host=await token(env.TOKEN_SECRET,'host',p);
 const r=await call('/api/party?party='+p.id,host,{...valid,revision:p.updated_at});assert.equal(r.status,200);
 Date.now=()=>now+100;
 const offset=sends.length;await deliverQueue({...env,MAIL_MODE:'live'});
 const sent=sends.slice(offset);
 assert(sent.some(m=>m.toAddress===p.email&&m.subject.startsWith('Thank you for your party details')&&m.content.includes(p.id)));
 assert(sent.some(m=>m.toAddress==='info@leapgymnastics.ca'&&m.subject==='Birthday preparation: invoice TEST-Basic'&&m.content.includes('/staff/')));
 assert.equal(db.prepare("SELECT count(*) n FROM messages WHERE party_id=? AND kind LIKE 'details-%' AND status='pending'").get(p.id).n,0);
 const countAfter=sends.length;await deliverQueue({...env,MAIL_MODE:'live'});assert.equal(sends.length,countAfter);
});
await test('guest consent emails go once to the signing parent and Leap, never expose host links',async()=>{const guest=sends.filter(m=>m.subject==='Your Leap consent form has been received'&&m.toAddress==='guest-parent@example.invalid');assert.equal(guest.length,1);assert.equal(guest[0].toAddress,'guest-parent@example.invalid');assert(!guest[0].content.includes('#host='));assert.equal(sends.filter(m=>m.subject==='Birthday guest consent received'&&m.toAddress==='info@leapgymnastics.ca').length,3);});
await test('native invoice mode schedules only two reminders and never queues a second booking email or historical catch-up',async()=>{
 env.NATIVE_INVOICE_CUTOVER_MS=String(torontoTime('2026-10-09','12:00 AM'));
 incoming=[msg('native-new','9991'),msg('native-old','9992')];bodies['native-new']=fixture();bodies['native-old']=fixture('Oct 8, 2026, 11:00 PM');
 await call('/internal/tick',env.TICK_SECRET,{});
 const p=db.prepare("SELECT * FROM parties WHERE invoice='9991'").get();assert(p);
 assert.equal(db.prepare("SELECT count(*) n FROM messages WHERE party_id=? AND kind='booking'").get(p.id).n,0);
 assert.equal(db.prepare("SELECT count(*) n FROM messages WHERE party_id=? AND (kind LIKE 'details-%' OR kind='waivers')").get(p.id).n,2);
 assert.equal(db.prepare("SELECT * FROM parties WHERE invoice='9992'").get(),undefined);
});
console.log(JSON.stringify({passed:count,syntheticOnly:true}));
if(process.argv.includes('--serve')){
 const {createServer}=await import('node:http');env.PUBLIC_ORIGIN='http://127.0.0.1:8769';env.MAIL_MODE='test';
 createServer(async(req,res)=>{try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const r=await worker.fetch(new Request(env.PUBLIC_ORIGIN+req.url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)}),env);res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));}catch(e){res.writeHead(500);res.end('Local test error');}}).listen(8769,'127.0.0.1');
 for(const p of db.prepare("SELECT * FROM parties WHERE invoice LIKE 'TEST-%'").all())console.log(p.package+' '+env.PUBLIC_ORIGIN+'/party/?party='+p.id+'#host='+await token(env.TOKEN_SECRET,'host',p));
}
