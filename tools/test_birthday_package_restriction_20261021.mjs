// Migration: synthetic reservation ID. Restore the authorized private override before deployment.
import assert from 'node:assert/strict';
import router from '../output/birthday-qc-20261016/existing-pages-router.mjs';
const id='00000000-0000-4000-8000-000000000025';
const party={id,package:'Pending',packageChoiceNeeded:true,details:null};
let calls=[], lookupStatus=200, current=party;
globalThis.fetch=async req=>{calls.push(req.method);return Response.json(req.method==='GET'?current:{saved:true},{status:lookupStatus});};
const request=(method='GET',body,partyId=id)=>new Request('https://leap-birthday-party-form.pages.dev/api/party?party='+partyId,{method,headers:{Authorization:'Bearer synthetic-test'},body:body?JSON.stringify(body):undefined});
let result=await router.fetch(request());
assert.deepEqual((await result.json()).unavailablePackages,['Deluxe']);
calls=[];result=await router.fetch(request('POST',{package:'Deluxe'}));
assert.equal(result.status,422);assert.deepEqual(calls,['GET']);
for(const packageName of ['Basic','Premium']){calls=[];result=await router.fetch(request('POST',{package:packageName}));assert.equal(result.status,200);assert.deepEqual(calls,['POST']);}
calls=[];lookupStatus=401;result=await router.fetch(request('POST',{package:'Deluxe'}));assert.equal(result.status,401);assert.deepEqual(calls,['GET']);
lookupStatus=200;current={...party,package:'Deluxe',packageChoiceNeeded:false};
result=await router.fetch(request());assert.equal((await result.json()).unavailablePackages,undefined);
current={...party,id:'other-booking'};result=await router.fetch(request('GET',undefined,'other-booking'));assert.equal((await result.json()).unavailablePackages,undefined);
console.log('Passed: scoped choices, Deluxe blocked before write, Basic/Premium preserved, authentication preserved, confirmed Deluxe and other bookings unchanged. No live writes or emails.');
