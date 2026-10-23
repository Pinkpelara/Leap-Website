import {hash,equal,escape as e} from './security.js';
import {send} from './mail.js';

const error=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
const stmt=(env,sql,...args)=>env.DB.prepare(sql).bind(...args);
const reply=data=>new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'}});
const secret=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
async function limit(env,key,max,expires){
 const result=await stmt(env,"INSERT INTO state(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=json_set(value,'$.count',json_extract(value,'$.count')+1) WHERE json_extract(value,'$.count')<?",key,JSON.stringify({count:1,expires}),max).run();
 if(!result.meta.changes)error('Please wait a few minutes before requesting another code.',429);
}

// Codes prove mailbox ownership only. Paid booking records determine form access.
export async function portal(req,env,input,{bookings,sendCode=send}){
 const path=new URL(req.url).pathname,now=Date.now();
 if(path==='/api/portal/request'&&req.method==='POST'){
  const email=String(input.email||'').trim().toLowerCase();
  if(email.length>200||!/^\S+@\S+\.\S+$/.test(email))error('Enter the email address you used to book your party.');
  await stmt(env,"DELETE FROM state WHERE key LIKE 'portal-%' AND json_valid(value) AND json_extract(value,'$.expires')<?",now-86400000).run();
  const bucket=Math.floor(now/900000),expires=(bucket+1)*900000;
  await limit(env,'portal-rate:email:'+await hash(email+':'+bucket),3,expires);
  await limit(env,'portal-rate:ip:'+await hash((req.headers.get('CF-Connecting-IP')||'unknown')+':'+bucket),15,expires);
  const id=secret();
  // Rejection sampling avoids modulo bias in the eight-digit code.
  let value;do{value=crypto.getRandomValues(new Uint32Array(1))[0];}while(value>=4200000000);
  const code=String(value%100000000).padStart(8,'0');
  await stmt(env,'INSERT INTO state(key,value) VALUES(?,?)','portal-code:'+id,JSON.stringify({email,codeHash:await hash(env.TOKEN_SECRET+':'+id+':'+code),expires:now+600000,attempts:0,used:false})).run();
  try{
   await sendCode(env,email,'Your Leap birthday form verification code',`<p>Hi,</p><p>Enter this code to open your birthday party forms:</p><p style="font-size:28px;letter-spacing:4px"><strong>${e(code)}</strong></p><p>The code expires in 10 minutes. If you didn’t request it, you can ignore this email.</p><p>Leap Gymnastics</p>`);
  }catch(err){await stmt(env,'DELETE FROM state WHERE key=?','portal-code:'+id).run();error('We couldn’t send your code. Please try again in a few minutes.',503);}
  return reply({challenge:id});
 }
 if(path==='/api/portal/verify'&&req.method==='POST'){
  const id=String(input.challenge||''),code=String(input.code||'').replace(/\s/g,'');
  if(!/^[a-f0-9]{64}$/.test(id)||!/^\d{8}$/.test(code))error('Enter the eight-digit code from your email.');
  const key='portal-code:'+id;
  const counted=await stmt(env,"UPDATE state SET value=json_set(value,'$.attempts',json_extract(value,'$.attempts')+1) WHERE key=? AND json_extract(value,'$.expires')>? AND json_extract(value,'$.used')=0 AND json_extract(value,'$.attempts')<5",key,now).run();
  if(!counted.meta.changes)error('This code has expired or has been used. Request a new code.',401);
  const record=JSON.parse((await stmt(env,'SELECT value FROM state WHERE key=?',key).first()).value);
  if(!equal(record.codeHash,await hash(env.TOKEN_SECRET+':'+id+':'+code)))error('That code doesn’t match. Check your email and try again.',401);
  const claimed=await stmt(env,"UPDATE state SET value=json_set(value,'$.used',1) WHERE key=? AND json_extract(value,'$.used')=0 AND json_extract(value,'$.expires')>?",key,now).run();
  if(!claimed.meta.changes)error('This code has already been used. Request a new code.',401);
  const session=secret(),sessionHash=await hash(session);
  await stmt(env,'INSERT INTO state(key,value) VALUES(?,?)','portal-session:'+sessionHash,JSON.stringify({email:record.email,expires:now+3600000})).run();
  return reply({session});
 }
 if(path==='/api/portal/bookings'&&req.method==='GET'){
  const session=req.headers.get('Authorization')?.replace(/^Bearer /,'')||'';
  if(!/^[a-f0-9]{64}$/.test(session))error('Please verify your email to open your forms.',401);
  const row=await stmt(env,'SELECT value FROM state WHERE key=?','portal-session:'+await hash(session)).first();
  const saved=row?JSON.parse(row.value):null;
  if(!saved||saved.expires<=now)error('Your session has expired. Please verify your email again.',401);
  return reply({bookings:await bookings(saved.email)});
 }
 return null;
}
