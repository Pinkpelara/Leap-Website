const emailForm=document.getElementById('findLink'),codeForm=document.getElementById('verifyCode'),notice=document.getElementById('notice'),results=document.getElementById('bookings'),refresh=document.getElementById('refreshBookings');
let challenge='',session='',poll;
const changeEmail=document.getElementById('changeEmail');
changeEmail.className='secondary';changeEmail.hidden=true;results.after(changeEmail);
async function api(path,data){
 const response=await fetch('/api/portal/'+path,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(session?{Authorization:'Bearer '+session}:{})},body:data?JSON.stringify(data):undefined,signal:AbortSignal.timeout(30000)});
 const result=await response.json();if(!response.ok)throw Error(result.error||'Please try again.');return result;
}
async function showBookings(){
 clearTimeout(poll);refresh.disabled=true;
 try{
  const data=await api('bookings');results.replaceChildren();
  for(const party of data.bookings){
   const card=document.createElement('section'),heading=document.createElement('h2'),description=document.createElement('p');
   heading.textContent=party.date;description.textContent=party.description;card.append(heading,description);
   for(const [label,url] of [['Complete your party form',party.host],['Open and share guest consent form',party.guest]]){const p=document.createElement('p'),a=document.createElement('a');a.textContent=label;a.href=url;a.className='button';p.append(a);card.append(p);}
   results.append(card);
  }
  refresh.hidden=!!data.bookings.length;
  notice.textContent=data.bookings.length?'Choose a form below.':'Your email is verified. If you just paid your deposit, your booking may take a few minutes to appear. We’ll check again automatically. Please make sure you used the same email address at checkout.';
  if(!data.bookings.length)poll=setTimeout(showBookings,15000);
 }catch(error){notice.textContent=error.message;refresh.hidden=false;}finally{refresh.disabled=false;}
}
emailForm.onsubmit=async event=>{
 event.preventDefault();const button=emailForm.querySelector('button');button.disabled=true;
 try{const result=await api('request',{email:emailForm.elements.email.value});challenge=result.challenge;emailForm.hidden=true;codeForm.hidden=false;changeEmail.hidden=false;notice.textContent='We’ve sent an eight-digit code. Check your inbox and junk folder. The code expires in 10 minutes.';codeForm.elements.code.focus();}
 catch(error){notice.textContent=error.message;}finally{button.disabled=false;}
};
codeForm.onsubmit=async event=>{
 event.preventDefault();const button=codeForm.querySelector('button');button.disabled=true;
 try{const result=await api('verify',{challenge,code:codeForm.elements.code.value});session=result.session;codeForm.hidden=true;await showBookings();}
 catch(error){notice.textContent=error.message;}finally{button.disabled=false;}
};
changeEmail.onclick=()=>{clearTimeout(poll);challenge='';session='';codeForm.reset();codeForm.hidden=true;emailForm.hidden=false;notice.textContent='';results.replaceChildren();refresh.hidden=true;changeEmail.hidden=true;emailForm.elements.email.focus();};
refresh.onclick=showBookings;
