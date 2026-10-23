import { COLOURS, PACKAGES, packageConfig, formatDate } from './domain.js';
import { escape as e } from './security.js';
const $=s=>document.querySelector(s), form=$('#details');
let p,busy=false;
const id=new URL(location.href).searchParams.get('party'), fragment=new URLSearchParams(location.hash.slice(1));
const key='leap-party-token:'+id;let storedHost='';try{storedHost=sessionStorage.getItem(key)||'';}catch{}
const host=fragment.get('host')||storedHost;
if(fragment.has('host')){try{sessionStorage.setItem(key,host);}catch{}}
const field=n=>form.elements.namedItem(n);
async function api(method='GET',data){
  const r=await fetch('/api/party?party='+encodeURIComponent(id||''),{method,headers:{Authorization:'Bearer '+host,'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined,signal:AbortSignal.timeout(30000)});
  const j=await r.json(); if(!r.ok)throw Error(j.errors?.join('\n')||j.error||'We could not save your details. Please try again.');return j;
}
function data(){
  const f=new FormData(form),d=Object.fromEntries(f);
  for(const k of ['beverages','independentAcknowledged','delivery'])d[k]=field(k).checked;
  d.colours=[...form.querySelectorAll('[name=colour]:checked')].map(x=>x.value);
  d.food=f.getAll('food');d.roster=String(f.get('guestNames')||'').split('\n').map(s=>s.trim()).filter(Boolean);
  d.agreements=Object.fromEntries(p.agreements.map(a=>[a.key,field(a.key).checked]));d.revision=p.updated_at;
  if($('#extrasFields').disabled)for(const k of ['loot','beverages'])d[k]=(p.details||p.prefill)?.[k]??{loot:0,beverages:false}[k];
  if(Date.now()>p.deadline&&(p.details||p.prefill)?.colours?.length)d.colours=(p.details||p.prefill).colours;
  if(!p.packageChoiceNeeded)delete d.package;
  return d;
}
function conditional(){
  const no=field('independent').value&&field('independent').value!=='Yes';
  $('#independentNote').hidden=!no;field('independentAcknowledged').required=!!no;
  field('foodAdult').required=![...form.querySelectorAll('[name=food]:checked')].some(x=>x.value==='No food');
}
function packageFields(){
  const pkg=p.packageChoiceNeeded?field('package').value:p.package,c=p.packageChoiceNeeded?packageConfig({...p,package:pkg}):p.config;
  $('#coloursSection').hidden=!c||pkg==='Basic';$('#beverageLabel').hidden=pkg!=='Premium';
  $('#balloonInfo').textContent=c?.balloons||'';
  $('#drinkInfo').hidden=!c||pkg==='Basic';
  $('#drinkDescription').textContent=c?.drinkDescription||'';
  $('#drinkInclusion').textContent=pkg==='Deluxe'?'Included with your Deluxe package.':'Available for $40 + HST.';
  for(const option of field('package').options){const config=packageConfig({...p,package:option.value});if(config)option.textContent=`${option.value} - $${config.price} + HST, ${config.included} children`;option.disabled=!!p.unavailablePackages?.includes(option.value);option.hidden=option.disabled;}
  field('children').max=c?.maxChildren??(c?24:22);
  field('loot').max=c?.newPolicy?22:(c?24:22);
  $('#childCost').textContent=c?c.newPolicy&&pkg==='Deluxe'?'22 children included; additional children are not available.':`${c.included} children included; additional children are $${c.extraChild} + HST each above ${c.included}, up to ${c.maxChildren??24} in total.`:'Maximum 22 participating children.';
  const selected=[...form.querySelectorAll('[name=colour]:checked')].map(x=>x.value);
  $('#colours').innerHTML=COLOURS.map(colour=>`<label class="check"><input type="${pkg==='Premium'?'radio':'checkbox'}" name="colour" value="${colour}" ${selected.includes(colour)?'checked':''}>${colour}</label>`).join('');
  field('loot').closest('label').hidden=!!c?.newPolicy&&pkg==='Deluxe';
  if(c?.newPolicy&&pkg==='Deluxe')field('loot').value='0';
  if(c?.favourDescription)$('#lootLabel').textContent='Mini Party Favour Bags - $7 + HST each. '+c.favourDescription;
  else if(c?.newPolicy)$('#lootLabel').textContent='Guest loot bags - $7 + HST each';
  else $('#lootLabel').textContent=pkg==='Deluxe'?`Additional loot bags beyond the ${c.included} included - $7 + HST each`:c?.gift?'Guest loot bags - $7 + HST each. The birthday child receives one in your package.':'Loot bags - $7 + HST each. No loot bag is included in the Basic package.';
}
function statuses(){
  $('#extraStatus').innerHTML=Object.values(p.extras).filter(x=>x?.label).map(x=>`<p><strong>${e(x.label)}:</strong> ${e(x.status)}${x.note?'. '+e(x.note):''}</p>`).join('');
  $('#waiverStatus').innerHTML=p.waivers.length?'<table><thead><tr><th>Child</th><th>Waiver</th></tr></thead><tbody>'+p.waivers.map(w=>`<tr><td>${e(w.name)}</td><td>${{received:'Received',needed:'Still needed',check:'Name needs checking'}[w.status]}</td></tr>`).join('')+'</tbody></table>':`<p>${p.waiversReceived} waiver(s) received. Add expected names to see who still needs one.</p>`;
  $('#booking').textContent=`${formatDate(p.start_at)} to ${new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',timeStyle:'short'}).format(p.finish_at)}${p.packageChoiceNeeded?'':'. '+p.package+' package'}.`;
}
function render(){
  $('#notice').textContent='';$('#party').hidden=false;$('#included').textContent=p.packageCopy;
  $('#deadline').textContent=Date.now()>p.deadline?'Please add any missing details as soon as you can. Your saved answers are shown below.':`Please complete your details and selections by ${formatDate(p.deadline)}.`;
  $('#bookingNotes').innerHTML=(p.bookingNotes||[]).map(x=>`<p>${e(x.replace('Your previously submitted party details have been saved. You do not need to complete them again; please add guest names as RSVPs arrive.','Your party details are saved. You can add guest names as RSVPs arrive.').replace('Your earlier food plan includes ice cream cake. Ice cream is not permitted under the published party rules; Leap needs to check this earlier request with you.','You listed ice cream cake in your food plans. Please contact us to discuss this, as ice cream is not permitted under our party food policy.'))}</p>`).join('');
  $('#packageSection').hidden=!p.packageChoiceNeeded;field('package').required=p.packageChoiceNeeded;
  $('#packageDeadline').textContent=p.packageAvailabilityNote||(p.packageDeadline?`Please choose your package by ${formatDate(p.packageDeadline)}.`:'');
  packageFields();$('#spaceNote').textContent=p.notes.space;
  $('#extrasDeadline').textContent=Date.now()>p.deadline?'The selection deadline has passed; your recorded choices are kept.':`Please choose any extras by ${formatDate(p.deadline)}. After that date, your selections are final.`;
  $('#extrasFields').disabled=Date.now()>p.deadline;
  $('#foodNote').textContent=p.notes.food;$('#decorNote').textContent=p.notes.decor;
  $('#foodChoices').innerHTML=['No food','Pizza','Sandwiches','Fruit or vegetables','Packaged snacks','Cake or cupcakes'].map(x=>`<label class="check"><input type="checkbox" name="food" value="${x}">${x}</label>`).join('');
  $('#planning').innerHTML=['timing','payment'].map(k=>`<p>${e(p.notes[k])}</p>`).join('');$('#guestLink').href=p.links.guest;
  $('#agreements').innerHTML=p.agreements.map(a=>`<label class="check"><input type="checkbox" name="${e(a.key)}" required><span>${e(a.text)}</span></label>`).join('');
  const d=p.details||p.prefill||{};
  for(const [k,v] of Object.entries(d)){
    const input=field(k);if(input instanceof HTMLElement){if(input.type==='checkbox')input.checked=!!v;else input.value=String(v??'');}
  }
  field('guestNames').value=(d.roster?.length?d.roster:[d.childName].filter(Boolean)).join('\n');
  for(const input of form.querySelectorAll('[name=colour]')){input.checked=(d.colours||[]).includes(input.value);input.disabled=Date.now()>p.deadline&&!!d.colours?.length;}
  for(const input of form.querySelectorAll('[name=food]'))input.checked=(d.food||[]).includes(input.value);
  for(const a of p.agreements)field(a.key).checked=d.agreements?.[a.key]===true;
  $('#saved').hidden=!p.details;conditional();statuses();
}
form.addEventListener('change',event=>{if(event.target.name==='package')packageFields();conditional();});
form.onsubmit=async event=>{
  event.preventDefault();if(busy||!form.reportValidity())return;
  busy=true;$('#submitButton').disabled=true;$('#submitButton').textContent='Saving...';
  try{const result=await api('POST',data());p=result.party;render();$('#errors').textContent='';$('#saved').scrollIntoView({behavior:'smooth'});}
  catch(error){$('#errors').textContent=error.message;$('#errors').scrollIntoView();}
  finally{busy=false;$('#submitButton').disabled=false;$('#submitButton').textContent='Save party details';}
};
try{p=await api();render();}catch(error){$('#notice').textContent=error.message+' Please use your booking email link or contact info@leapgymnastics.ca.';}

$('#copyGuest').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(p.links.guest);$('#copyFeedback').textContent='Link copied. You can send it to the families attending your party.';}catch{const field=document.createElement('input');field.readOnly=true;field.value=p.links.guest;field.setAttribute('aria-label','Guest waiver link');$('#copyFeedback').replaceChildren(field);field.select();}});
