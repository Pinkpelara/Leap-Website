import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {portal} from '../cloudflare-pages/birthday-qc-20261016/portal.js';
const db=new DatabaseSync(':memory:');db.exec('CREATE TABLE state(key TEXT PRIMARY KEY,value TEXT)');
const env={TOKEN_SECRET:'synthetic-only',DB:{prepare(sql){return{args:[],bind(...args){this.args=args;return this;},async first(){return db.prepare(sql).get(...this.args);},async run(){return {meta:{changes:Number(db.prepare(sql).run(...this.args).changes)}};}};}}};
const sent=[],lookups=[];
const deps={sendCode:async(_env,email,subject,html)=>{sent.push({email,subject,code:/<strong>(\d{8})<\/strong>/.exec(html)[1]});},bookings:async email=>{lookups.push(email);return email==='parent@example.invalid'?[{date:'Synthetic party',host:'https://example.invalid/private'}]:[];}};
async function call(path,input={},session=''){
 const req=new Request('https://example.invalid/api/portal/'+path,{method:path==='bookings'?'GET':'POST',headers:{Authorization:'Bearer '+session,'CF-Connecting-IP':'127.0.0.1'}});
 try{const response=await portal(req,env,input,deps);return {status:response.status,...await response.json()};}catch(err){return {status:err.status,error:err.message};}
}
let passed=0;async function test(name,fn){await fn();passed++;console.log('PASS '+name);}
let challenge,session;
await test('request sends only a code and returns no code or booking data',async()=>{const r=await call('request',{email:'Parent@example.invalid'});challenge=r.challenge;assert.equal(r.status,200);assert(!JSON.stringify(r).includes(sent[0].code));assert.equal(sent[0].email,'parent@example.invalid');assert.equal(lookups.length,0);});
await test('unverified requests cannot read forms',async()=>{assert.equal((await call('bookings')).status,401);assert.equal((await call('bookings',{},'a'.repeat(64))).status,401);});
await test('incorrect code does not authorize access',async()=>{const wrong=sent[0].code==='00000000'?'11111111':'00000000';assert.equal((await call('verify',{challenge,code:wrong})).status,401);});
await test('correct code opens only the verified mailbox bookings',async()=>{const r=await call('verify',{challenge,code:sent[0].code});session=r.session;assert.equal(r.status,200);assert.equal((await call('bookings',{},session)).bookings.length,1);assert.deepEqual(lookups,['parent@example.invalid']);});
await test('code cannot be reused',async()=>{assert.equal((await call('verify',{challenge,code:sent[0].code})).status,401);});
await test('expired session cannot read forms',async()=>{db.prepare("UPDATE state SET value=json_set(value,'$.expires',0) WHERE key LIKE 'portal-session:%'").run();assert.equal((await call('bookings',{},session)).status,401);});
await test('five wrong attempts lock the challenge',async()=>{const r=await call('request',{email:'second@example.invalid'}),code=sent.at(-1).code;for(let i=0;i<5;i++)assert.equal((await call('verify',{challenge:r.challenge,code:code==='00000000'?'11111111':'00000000'})).status,401);assert.equal((await call('verify',{challenge:r.challenge,code})).status,401);});
await test('expired code cannot authorize',async()=>{const r=await call('request',{email:'third@example.invalid'});db.prepare("UPDATE state SET value=json_set(value,'$.expires',0) WHERE key=?").run('portal-code:'+r.challenge);assert.equal((await call('verify',{challenge:r.challenge,code:sent.at(-1).code})).status,401);});
await test('email request rate is limited',async()=>{await call('request',{email:'parent@example.invalid'});await call('request',{email:'parent@example.invalid'});assert.equal((await call('request',{email:'parent@example.invalid'})).status,429);});
await test('unbooked mailbox does not receive someone else’s forms',async()=>{const r=await call('request',{email:'unbooked@example.invalid'});const v=await call('verify',{challenge:r.challenge,code:sent.at(-1).code});assert.deepEqual((await call('bookings',{},v.session)).bookings,[]);});
console.log(JSON.stringify({passed,syntheticOnly:true}));
