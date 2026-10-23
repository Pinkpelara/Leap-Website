import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs/promises';
import path from 'node:path';
import {emailFor} from '../cloudflare-pages/birthday-qc-20261016/emails.js';
import {deliverQueue} from '../cloudflare-pages/birthday-qc-20261016/delivery.js';
import {torontoTime} from '../cloudflare-pages/birthday-qc-20261016/domain.js';
import scheduler from '../cloudflare-pages/birthday-qc-20261016/scheduler.js';
import worker from '../cloudflare-pages/birthday-qc-20261016/entry-worker.js';
import {token} from '../cloudflare-pages/birthday-qc-20261016/security.js';
import {POLICY} from '../cloudflare-pages/birthday-qc-20261016/billing.js';
const root=process.cwd(),out=path.join(root,'output/birthday-qc-20261016');
const db=new DatabaseSync(':memory:');db.exec(await fs.readFile(path.join(root,'cloudflare-pages/birthday-qc-20261016/schema.sql'),'utf8'));
const DB={prepare(sql){return {args:[],bind(...a){this.args=a;return this;},async first(){return db.prepare(sql).get(...this.args)||null;},async all(){return {results:db.prepare(sql).all(...this.args)};},async run(){return {meta:{changes:Number(db.prepare(sql).run(...this.args).changes)}};}};},async batch(list){db.exec('BEGIN');try{const a=[];for(const s of list)a.push(await s.run());db.exec('COMMIT');return a;}catch(e){db.exec('ROLLBACK');throw e;}}};
Date.now=()=>torontoTime('2026-10-16','6:00 PM');
const env={DB,TOKEN_SECRET:'synthetic-only',TICK_SECRET:'synthetic-tick',MAIL_MODE:'live',ZOHO_ACCOUNT_ID:'mock',PUBLIC_ORIGIN:'https://example.invalid',CUTOVER_MS:'1791518400000'};
const p={id:crypto.randomUUID(),invoice:'TEST-1',email:'parent@example.invalid',start_at:torontoTime('2026-11-29','1:30 PM'),booked_at:torontoTime('2026-10-15','12:00 PM'),package:'Basic',version:1,updated_at:Date.now(),status:'active',extras:'{}'};
db.prepare('INSERT INTO parties(id,invoice,email,start_at,booked_at,package,updated_at,source_message,extras) VALUES(?,?,?,?,?,?,?,?,?)').run(p.id,p.invoice,p.email,p.start_at,p.booked_at,p.package,p.updated_at,'test','{}');
let sent=[],failSend=false,intakeFixture=false;
globalThis.fetch=async(url,opts={})=>{
 const u=String(url);if(u.includes('/oauth/v2/token'))return Response.json({access_token:'test'});
 if(u.includes('/messages/search')){if(intakeFixture)return Response.json({data:[{messageId:'broken-receipt',receivedTime:String(Date.now()),fromAddress:'no-reply@leapgymnastics.uplifterinc.com',subject:'Leap Gymnastics Invoice #00000001',folderId:'test'}]});throw Error('Simulated mailbox outage');}
 if(intakeFixture&&u.includes('/header?'))return Response.json({data:{headerContent:{'authentication-results':'mx.zohomailcloud.ca; dkim=pass header.i=@leapgymnastics.uplifterinc.com; dmarc=pass header.from=leapgymnastics.uplifterinc.com'}}});
 if(intakeFixture&&u.endsWith('/content'))return Response.json({data:{content:'<p>Malformed receipt</p>'}});
 if(u.endsWith('/messages')){if(failSend)throw Error('Simulated timeout');sent.push(JSON.parse(opts.body));return Response.json({data:{messageId:'test-'+sent.length}});}
 throw Error('Unexpected network call: '+u);
};
let count=0;const test=async(name,fn)=>{await fn();count++;console.log('PASS '+name);};
const add=(id,kind,at=Date.now()-1000)=>db.prepare('INSERT INTO messages(id,party_id,kind,due_at) VALUES(?,?,?,?)').run(id,p.id,kind,at);
await test('six queued saves produce one confirmation',async()=>{for(let i=0;i<6;i++)add('save-'+i,'receipt',Date.now()-6000+i);await deliverQueue(env);assert.equal(sent.length,1);assert.equal(db.prepare("SELECT count(*) n FROM messages WHERE status='skipped'").get().n,5);});
await test('render failure does not block another parent message',async()=>{add('bad-kind','unknown');add('good-waiver','waivers');await deliverQueue(env);assert.equal(db.prepare("SELECT status FROM messages WHERE id='bad-kind'").get().status,'render-error');assert.equal(db.prepare("SELECT status FROM messages WHERE id='good-waiver'").get().status,'sent');});
await test('uncertain send is not retried automatically',async()=>{add('timeout','receipt');failSend=true;await deliverQueue(env);failSend=false;const before=sent.length;await deliverQueue(env);assert.equal(sent.length,before);assert.equal(db.prepare("SELECT status FROM messages WHERE id='timeout'").get().status,'uncertain');});
await test('disabled mail mode cannot mark a message as sent',async()=>{add('dry','receipt');await deliverQueue({...env,MAIL_MODE:'test'});assert.equal(db.prepare("SELECT status FROM messages WHERE id='dry'").get().status,'pending');});
await test('booking importer outage does not block already queued mail',async()=>{const r=await worker.fetch(new Request('https://example.invalid/internal/tick',{headers:{Authorization:'Bearer '+env.TICK_SECRET}}),env);const result=await r.json();assert(result.errors.includes('booking-import'));assert.equal(db.prepare("SELECT status FROM messages WHERE id='dry'").get().status,'sent');});
await test('unreadable receipt cannot hold an existing booking or permanently suppress retry',async()=>{
 db.prepare('UPDATE parties SET invoice=? WHERE id=?').run('1',p.id);
 intakeFixture=true;
 try{
  const before=db.prepare("SELECT value FROM state WHERE key='last_ingest'").get();
  await worker.fetch(new Request('https://example.invalid/internal/tick',{headers:{Authorization:'Bearer '+env.TICK_SECRET}}),env);
  assert.equal(db.prepare('SELECT status FROM parties WHERE id=?').get(p.id).status,'active');
  assert.equal(db.prepare("SELECT count(*) n FROM source_messages WHERE id='broken-receipt'").get().n,0);
  assert.deepEqual(db.prepare("SELECT value FROM state WHERE key='last_ingest'").get(),before);
  assert(db.prepare("SELECT value FROM state WHERE key='intake-error:broken-receipt'").get());
 }finally{intakeFixture=false;db.prepare('UPDATE parties SET invoice=? WHERE id=?').run(p.invoice,p.id);}
});
await test('scheduler uses service binding with authentication',async()=>{let called=false;await scheduler.scheduled({}, {TICK_SECRET:'test',WORKFLOW:{async fetch(req){called=true;assert.equal(req.headers.get('Authorization'),'Bearer test');return Response.json({errors:[]});}}});assert(called);await assert.rejects(()=>scheduler.scheduled({},{}));});
await test('guest token cannot open host details',async()=>{const guest=await token(env.TOKEN_SECRET,'guest',p);const r=await worker.fetch(new Request('https://example.invalid/api/party?party='+p.id,{headers:{Authorization:'Bearer '+guest}}),env);assert.equal(r.status,403);});
await test('both waiver versions preserve sharing and legal wording',async()=>{for(const dir of ['consent','standalone-consent']){const s=await fs.readFile(path.join(root,'cloudflare-pages/birthday-qc-20261016',dir,'app.js'),'utf8');assert(!s.includes('history.replaceState'));assert(s.includes('Copy guest waiver link'));assert(s.includes("'#guest=' + encodeURIComponent(birthdayGuestToken)"));}const original=await fs.readFile(path.join(root,'cloudflare-pages/birthday-invoicing-20261013/consent/index.html'),'utf8');assert.equal(await fs.readFile(path.join(root,'cloudflare-pages/birthday-qc-20261016/consent/index.html'),'utf8'),original);});
const previews=[];
await test('all package generations render without internal notes or unsupported requests',async()=>{for(const pkg of ['Basic','Premium','Deluxe'])for(const old of [true,false]){
 const party={...p,package:pkg,booked_at:old?torontoTime('2026-10-04','12:00 PM'):p.booked_at};
 for(const kind of ['booking','receipt','details-ten','waivers']){const mail=await emailFor(env,party,kind);assert(!/Previously recorded|shown above|You don’t need|undefined|Preview package/.test(mail.content));if(old&&pkg==='Basic'&&kind==='booking'){assert(mail.content.includes('$350'));assert(mail.content.includes('no private party room'));}if(pkg==='Basic'&&!old){previews.push({kind,...mail});await fs.writeFile(path.join(out,kind+'.html'),mail.content);}}
 }});
await test('legacy emails retain existing host and waiver destinations',async()=>{const mail=await emailFor({...env,PUBLIC_ORIGIN:'https://leap-birthday-party-form.pages.dev',GUEST_ORIGIN:'https://leap-participant-consent-form.pages.dev'},p,'receipt');assert(mail.content.includes('https://leap-participant-consent-form.pages.dev/?party='));assert(mail.content.includes('https://leap-birthday-party-form.pages.dev/party/'));});
await test('invoice-policy emails retain approved payment instructions',async()=>{
 const party={...p,extras:JSON.stringify({booking:{billing:{policy:POLICY,depositCents:11300,depositReference:'TEST'}}})};
 for(const kind of ['booking','receipt']){const mail=await emailFor(env,party,kind);assert(mail.content.includes(kind==='booking'?'no later than the day before your party':'separate email'));previews.push({kind:'billing-'+kind,...mail});await fs.writeFile(path.join(out,'billing-'+kind+'.html'),mail.content);}
});
await test('recovery searches both booking databases',async()=>{
 let searched=false,queued=false;
 const legacy={prepare(sql){return {bind(){return this;},async all(){searched=true;return {results:[{...p,id:'old-test'}]};}};},async batch(){queued=true;}};
 const r=await worker.fetch(new Request('https://example.invalid/api/find-link',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:p.email})}),{...env,LEGACY_DB:legacy});
 assert.equal(r.status,200);assert(searched&&queued);assert(db.prepare("SELECT id FROM messages WHERE kind='link'").get());
});
await test('requested links send immediately and remain available during the party',async()=>{
 const party={...p,id:crypto.randomUUID(),invoice:'IMMEDIATE',email:'immediate@example.invalid',start_at:Date.now()-3600000};
 db.prepare('INSERT INTO parties(id,invoice,email,start_at,booked_at,package,updated_at,source_message,extras) VALUES(?,?,?,?,?,?,?,?,?)').run(party.id,party.invoice,party.email,party.start_at,party.booked_at,party.package,Date.now(),'synthetic','{}');
 const pending=[];const r=await worker.fetch(new Request('https://example.invalid/api/find-link',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:party.email})}),env,{waitUntil(promise){pending.push(promise);}});
 assert.equal(r.status,200);await Promise.all(pending);
 const job=db.prepare("SELECT * FROM messages WHERE party_id=? AND kind='link'").get(party.id);assert.equal(job.status,'sent');
 assert(sent.some(m=>m.toAddress===party.email&&m.content.includes('/party/?party='+party.id)&&m.content.includes('#guest=')));
});
await test('recovery does not silently omit the twenty-first matching booking',async()=>{
 for(let i=0;i<21;i++)db.prepare('INSERT INTO parties(id,invoice,email,start_at,booked_at,package,updated_at,source_message,extras) VALUES(?,?,?,?,?,?,?,?,?)').run(crypto.randomUUID(),'MANY-'+i,'many@example.invalid',p.start_at,p.booked_at,p.package,Date.now(),'synthetic','{}');
 const r=await worker.fetch(new Request('https://example.invalid/api/find-link',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'many@example.invalid'})}),{...env,MAIL_MODE:'test'});
 assert.equal(r.status,200);assert.equal(db.prepare("SELECT COUNT(*) n FROM messages m JOIN parties p ON m.party_id=p.id WHERE p.email='many@example.invalid' AND m.kind='link'").get().n,21);
});
await test('older parent package choice cannot block any email queue',async()=>{
 const pending={...p,id:crypto.randomUUID(),invoice:'CHOICE',package:'Pending',extras:JSON.stringify({booking:{packageChoiceNeeded:true}})};
 db.prepare('INSERT INTO parties(id,invoice,email,start_at,booked_at,package,updated_at,source_message,extras) VALUES(?,?,?,?,?,?,?,?,?)').run(pending.id,pending.invoice,pending.email,pending.start_at,pending.booked_at,pending.package,pending.updated_at,'test',pending.extras);
 db.prepare('INSERT INTO messages(id,party_id,kind,due_at) VALUES(?,?,?,?)').run('pending-choice',pending.id,'details-overdue',Date.now()-1000);
 add('following-normal','receipt');
 await deliverQueue(env);
 for(const id of ['pending-choice','following-normal'])assert.equal(db.prepare('SELECT status FROM messages WHERE id=?').get(id).status,'sent');
 const mail=await emailFor({...env,PUBLIC_ORIGIN:'https://legacy.example.invalid'},pending,'booking');
 assert(mail.content.includes('choose your party package'));assert(!mail.content.includes('$'));assert(!mail.content.includes('undefined'));assert(mail.content.includes('https://legacy.example.invalid/party/'));
});
await fs.writeFile(path.join(out,'test-results.json'),JSON.stringify({passed:count,syntheticOnly:true,published:false},null,2));
console.log(JSON.stringify({passed:count,syntheticOnly:true}));
