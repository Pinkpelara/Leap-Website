import {quote,quoteHtml} from './billing.js';
const id=new URLSearchParams(location.search).get('party'),fragment=new URLSearchParams(location.hash.slice(1));
let storedHost='';try{storedHost=sessionStorage.getItem('leap-host:'+id)||'';}catch{}
const key=fragment.get('host')||storedHost;
if(fragment.has('host')){try{sessionStorage.setItem('leap-host:'+id,key);}catch{}}
let booking;
async function api(method='GET',body){const response=await fetch('/api/party?party='+encodeURIComponent(id),{method,headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});const data=await response.json();if(!response.ok)throw Error(data.errors?.join(' · ')||data.error||'Please try again.');return data;}
function show(p){
 booking=p;document.getElementById('content').innerHTML=p.formHtml;
 const form=document.getElementById('partyForm'),d=p.draft?.data||p.details||{},el=form.elements;
 const draftNotice=document.createElement('p');draftNotice.id='draftNotice';draftNotice.setAttribute('role','status');
 draftNotice.textContent=p.draft?'You have saved changes that have not been submitted to Leap.':'';form.prepend(draftNotice);
 for(const name of ['childName','childAge','phone','children','ageRange','support','loot','foodAdult'])if(el[name])el[name].value=d[name]??(name==='loot'?0:'');
 if(!d.childName)el.childName.value=p.child_name||'';
 for(const box of form.querySelectorAll('[name=independent]'))box.checked=box.value===d.independent;
 for(const box of form.querySelectorAll('[name=colour]'))box.checked=(d.colours||[]).includes(box.value);
 for(const box of form.querySelectorAll('[name=food]'))box.checked=(d.food||[]).includes(box.value==='We won’t be serving food'?'No food':box.value);
 for(const box of form.querySelectorAll('[name=decor]'))box.checked=box.value===(d.decor==='Bring tabletop or freestanding decorations'?'bring':d.decor?'none':'');
 for(const name of ['beverages','delivery'])if(el[name])el[name].checked=!!d[name];
 for(const a of p.agreements)el[a.key].checked=!!d.agreements?.[a.key];
 const summary=document.getElementById('billingSummary');
 function refreshQuote(){if(!summary)return;try{summary.innerHTML=quoteHtml(quote({...p,extras:JSON.stringify(p.extras)},{children:el.children.value,loot:el.loot?.value||0,beverages:!!el.beverages?.checked}));}catch(error){summary.textContent=error.message;}}
 refreshQuote();form.addEventListener('input',refreshQuote);form.addEventListener('change',refreshQuote);
 el.guestNames.value=(d.roster||[]).join('\n');
 const ack=document.getElementById('participationAck');ack.checked=!!d.independentAcknowledged;
 function independence(){const needs=el.independent.value&&el.independent.value!=='Yes';document.getElementById('participationHelp').hidden=!needs;ack.required=!!needs;}independence();
 form.addEventListener('change',event=>{if(event.target.name==='independent')independence();if(event.target.name==='food'&&event.target.checked)for(const box of form.querySelectorAll('[name=food]')){if((event.target.value==='We won’t be serving food'&&box!==event.target)||(event.target.value!=='We won’t be serving food'&&box.value==='We won’t be serving food'))box.checked=false;}});
 document.getElementById('waiverCount').textContent=p.waiversReceived;
 for(const w of p.waivers){const li=document.createElement('li');li.textContent=w.name+': '+({received:'waiver received',needed:'waiver still needed',check:'please ask Leap to check this name'}[w.status]);document.getElementById('waiverStatus').append(li);}
 const waiverButton=document.getElementById('waiverButton');const a=document.createElement('a');a.href=p.links.guest;a.target='_blank';a.rel='noopener';a.className='button secondary';a.textContent='Open guest waiver';waiverButton.replaceWith(a);
 const share=document.createElement('button');share.type='button';share.className='secondary';share.textContent='Copy guest waiver link';a.after(share);share.onclick=async()=>{try{await navigator.clipboard.writeText(p.links.guest);share.textContent='Guest waiver link copied';}catch{const field=document.createElement('input');field.readOnly=true;field.value=p.links.guest;share.after(field);field.select();share.remove();}};
 if(Date.now()>p.optionalDeadline){for(const name of ['loot','beverages'])if(el[name])el[name].disabled=true;if(d.colours?.length)for(const box of form.querySelectorAll('[name=colour]'))box.disabled=true;}
 async function saveForm(action){const error=document.getElementById('formError'),buttons=[...form.querySelectorAll('button[type=submit],#saveDraft')];error.textContent='';buttons.forEach(b=>b.disabled=true);
  const values=Object.fromEntries(new FormData(form));
  const payload={...values,action,revision:p.updated_at,loot:el.loot?.value||0,beverages:!!el.beverages?.checked,delivery:el.delivery.checked,independentAcknowledged:ack.checked,colours:[...form.querySelectorAll('[name=colour]:checked')].map(x=>x.value),food:[...form.querySelectorAll('[name=food]:checked')].map(x=>x.value==='We won’t be serving food'?'No food':x.value),decor:values.decor==='bring'?'Bring tabletop or freestanding decorations':values.decor==='none'?'Use the included setup':'',roster:el.guestNames.value.split('\n'),agreements:Object.fromEntries(p.agreements.map(a=>[a.key,el[a.key].checked]))};
  try{const result=await api('POST',payload);booking=result.party;if(action==='save'){p=result.party;draftNotice.textContent='Your progress is saved. Select Save and submit when you’re ready to send it to Leap.';return;}form.hidden=true;const success=document.getElementById('formSuccess');success.hidden=false;if(result.previewDelivery){let delivery=document.getElementById('previewDelivery');if(!delivery){delivery=document.createElement('div');delivery.id='previewDelivery';success.append(delivery);}delivery.replaceChildren();const note=document.createElement('p');note.textContent='Preview: your confirmation and itemized invoice were generated automatically. No email was sent.';delivery.append(note);for(const [label,url] of [['View invoice',result.previewDelivery.invoiceUrl],['View confirmation email',result.previewDelivery.confirmationUrl]]){const link=document.createElement('a');link.href=url;link.className='button secondary';link.textContent=label;delivery.append(link);}}success.scrollIntoView({block:'start'});}catch(err){error.textContent=err.message;}finally{buttons.forEach(b=>b.disabled=false);}
 };
 form.onsubmit=event=>{event.preventDefault();saveForm('submit');};
 document.getElementById('saveDraft').onclick=()=>saveForm('save');
 document.getElementById('returnButton').onclick=()=>show(booking);
}
api().then(show).catch(err=>{document.getElementById('loading').textContent=err.message+' Please reopen the private link in your email or contact info@leapgymnastics.ca.';});
