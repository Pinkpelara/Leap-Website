import {hash,escape as e} from './security.js';
import {policyFor,quote,money,CANCELLATION_COPY} from './billing.js';

let cached;
export async function invoiceApi(env,path,body,method=body?'POST':'GET') {
  if(!cached||cached.until<Date.now()+60000||cached.key!==env.INVOICE_CLIENT_ID){
    const response=await fetch('https://accounts.zohocloud.ca/oauth/v2/token',{method:'POST',body:new URLSearchParams({grant_type:'refresh_token',client_id:env.INVOICE_CLIENT_ID,client_secret:env.INVOICE_CLIENT_SECRET,refresh_token:env.INVOICE_REFRESH_TOKEN}),signal:AbortSignal.timeout(15000)});
    const data=await response.json();
    if(!response.ok||!data.access_token)throw Error('Invoice authorization could not be confirmed.');
    cached={key:env.INVOICE_CLIENT_ID,token:data.access_token,until:Date.now()+(data.expires_in||3600)*1000};
  }
  const response=await fetch('https://www.zohoapis.ca/invoice/v3'+path,{method,headers:{Authorization:'Zoho-oauthtoken '+cached.token,'X-com-zoho-invoice-organizationid':env.INVOICE_ORGANIZATION_ID,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});
  const data=await response.json();
  if(!response.ok||data.code!==0)throw Error('Zoho Invoice request could not be confirmed.');
  return data;
}
export function invoicePayload(p,q,customerId,number){
  return {customer_id:customerId,invoice_number:number,reference_number:'LEAP-PARTY-'+p.id,date:new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(Date.now()),due_date:q.dueDate,
    line_items:[...q.lines.map(line=>({name:line.description,quantity:line.quantity,rate:line.rateCents/100})),{name:'HST (13%)',description:'13% of '+money(q.subtotalCents),quantity:1,rate:q.taxCents/100}],
    adjustment:-q.depositCents/100,adjustment_description:'Deposit paid (including HST)',
    notes:`Subtotal: ${money(q.subtotalCents)}. HST (13%): ${money(q.taxCents)}. Total including HST: ${money(q.totalCents)}. Deposit paid (including HST): ${money(q.depositCents)}. Remaining balance: ${money(q.balanceCents)}.`,
    terms:`Payment must be received by e-transfer to info@leapgymnastics.ca no later than the day before your party. Please include your invoice number in the transfer message. ${CANCELLATION_COPY}`};
}
const sql=(env,text,...args)=>env.DB.prepare(text).bind(...args);
const recoveryWait=15*60*1000;
async function rememberAttempt(env,job,value){await sql(env,'INSERT INTO state(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value','invoice-attempt:'+job.party_id,JSON.stringify({fingerprint:job.fingerprint,...value})).run();}
async function recoverInvoices(env){
 const jobs=(await sql(env,"SELECT * FROM party_invoices WHERE status IN ('uncertain','sending') AND attempted_at<? LIMIT 10",Date.now()-recoveryWait).all()).results;
 for(const job of jobs){
  const tracked=await sql(env,'SELECT value FROM state WHERE key=?','invoice-attempt:'+job.party_id).first();
  if(!tracked)continue;
  const attempt=JSON.parse(tracked.value);
  if(attempt.fingerprint!==job.fingerprint){
   await sql(env,"UPDATE party_invoices SET status='pending',error=NULL WHERE party_id=? AND fingerprint=? AND attempted_at=? AND status IN ('uncertain','sending')",job.party_id,job.fingerprint,job.attempted_at).run();
   continue;
  }
  try{
   const ref='LEAP-PARTY-'+job.party_id;
   const found=job.provider_id?[{invoice_id:job.provider_id}]:(await invoiceApi(env,'/invoices?reference_number='+encodeURIComponent(ref))).invoices.filter(i=>i.reference_number===ref);
   if(found.length>1)continue;
   let delivered=false,invoice;
   if(found.length){
    invoice=(await invoiceApi(env,'/invoices/'+found[0].invoice_id)).invoice;
    const q=JSON.parse(job.payload);
    if(invoice.currency_code!=='CAD'||Number(invoice.balance)!==Number(invoice.total))throw Error('Invoice has a recorded payment or unexpected currency.');
    if(attempt.phase==='send'){
     reconcileTotal(invoice,q);
     const history=(await invoiceApi(env,'/invoices/'+invoice.invoice_id+'/comments')).comments;
     if(!Array.isArray(history))throw Error('Invoice history unavailable');
     delivered=(!attempt.wasEmailed&&invoice.is_emailed===true)||history.some(x=>!attempt.history.includes(String(x.comment_id))&&/emailed|email sent/i.test(String(x.operation_type)+' '+String(x.description)));
    }
   }
   await sql(env,"UPDATE party_invoices SET status=?,provider_id=COALESCE(?,provider_id),sent_at=CASE WHEN ? THEN ? ELSE sent_at END,error=NULL WHERE party_id=? AND fingerprint=? AND attempted_at=? AND status IN ('uncertain','sending')",delivered?'sent':'pending',invoice?.invoice_id||null,delivered?1:0,Date.now(),job.party_id,job.fingerprint,job.attempted_at).run();
  }catch{ /* Recheck automatically once the provider is available. */ }
 }
}
export async function queueInvoice(env,p,d,now,revision){
  if(!policyFor(p))return null;
  const q=quote(p,d),payload=JSON.stringify(q),fingerprint=await hash(payload);
  return sql(env,"INSERT INTO party_invoices(party_id,fingerprint,payload,status,updated_at) SELECT ?,?,?,'pending',? WHERE EXISTS(SELECT 1 FROM parties WHERE id=? AND updated_at=?) ON CONFLICT(party_id) DO UPDATE SET fingerprint=excluded.fingerprint,payload=excluded.payload,status=CASE WHEN party_invoices.status IN ('sending','uncertain') THEN 'uncertain' ELSE 'pending' END,updated_at=excluded.updated_at WHERE party_invoices.fingerprint<>excluded.fingerprint",p.id,fingerprint,payload,now,p.id,revision);
}
function reconcileTotal(invoice,q){
  if(invoice.currency_code!=='CAD')throw Error('Invoice currency must be Canadian dollars.');
  if(Math.round(Number(invoice.total)*100)!==q.balanceCents)throw Error('Invoice total does not match the saved form.');
  if(Math.round(Number(invoice.balance)*100)!==q.balanceCents)throw Error('This invoice has a recorded payment or credit and needs review before changes.');
}
async function customer(env,p){
  const found=await invoiceApi(env,'/contacts?email='+encodeURIComponent(p.email));
  const matches=found.contacts.filter(c=>String(c.email||'').toLowerCase()===p.email.toLowerCase());
  if(matches.length>1)throw Error('More than one matching invoice customer needs review.');
  if(matches.length===1)return matches[0].contact_id;
  const created=await invoiceApi(env,'/contacts',{contact_name:'Birthday booking '+p.invoice,contact_type:'customer',contact_persons:[{email:p.email,is_primary_contact:true}]});
  return created.contact.contact_id;
}
export async function deliverInvoices(env,onlyParty){
  if(env.INVOICE_MODE!=='live')return {invoicesSent:0};
  if((await sql(env,"SELECT value FROM state WHERE key='automation_paused'").first())?.value==='1')return {invoicesSent:0};
  await recoverInvoices(env);
  const jobs=(await sql(env,"SELECT * FROM party_invoices WHERE status='pending'"+(onlyParty?' AND party_id=?':'')+' ORDER BY updated_at LIMIT 10',...(onlyParty?[onlyParty]:[])).all()).results;
  let invoicesSent=0;
  for(const job of jobs){
    const p=await sql(env,"SELECT * FROM parties WHERE id=? AND status='active'",job.party_id).first();
    if(!p||p.start_at<=Date.now())continue;
    const claim=await sql(env,"UPDATE party_invoices SET status='sending',attempted_at=? WHERE party_id=? AND fingerprint=? AND status='pending'",Date.now(),p.id,job.fingerprint).run();
    if(!claim.meta.changes)continue;
    try{
      await rememberAttempt(env,job,{phase:'prepare'});
      const q=JSON.parse(job.payload),reference='LEAP-PARTY-'+p.id;
      let invoice;
      if(job.provider_id){
        invoice=(await invoiceApi(env,'/invoices/'+job.provider_id)).invoice;
        if(Math.round(Number(invoice.balance)*100)!==Math.round(Number(invoice.total)*100))throw Error('Recorded payment needs review before updating this invoice.');
        invoice=(await invoiceApi(env,'/invoices/'+job.provider_id,invoicePayload(p,q,invoice.customer_id,invoice.invoice_number),'PUT')).invoice;
      }else{
        const existing=await invoiceApi(env,'/invoices?reference_number='+encodeURIComponent(reference));
        const matches=existing.invoices.filter(i=>i.reference_number===reference);
        if(matches.length>1)throw Error('Multiple invoice records for the booking.');
        const number='LEAP-'+p.id.replaceAll('-','').slice(0,16).toUpperCase();
        invoice=matches.length?(await invoiceApi(env,'/invoices/'+matches[0].invoice_id)).invoice:(await invoiceApi(env,'/invoices?ignore_auto_number_generation=true',invoicePayload(p,q,await customer(env,p),number))).invoice;
        if(matches.length&&Math.round(Number(invoice.total)*100)!==q.balanceCents){
          if(Number(invoice.balance)!==Number(invoice.total))throw Error('Recorded payment prevents changing this invoice.');
          invoice=(await invoiceApi(env,'/invoices/'+invoice.invoice_id,invoicePayload(p,q,invoice.customer_id,invoice.invoice_number),'PUT')).invoice;
        }
      }
      reconcileTotal(invoice,q);
      await sql(env,'UPDATE party_invoices SET provider_id=?,invoice_number=? WHERE party_id=?',invoice.invoice_id,invoice.invoice_number,p.id).run();
      const current=await sql(env,'SELECT fingerprint FROM party_invoices WHERE party_id=?',p.id).first();
      if(current.fingerprint!==job.fingerprint)throw Error('Party costs changed while the invoice was being prepared.');
      if((await sql(env,'SELECT status FROM parties WHERE id=?',p.id).first())?.status!=='active')throw Error('Booking was paused or cancelled while the invoice was being prepared.');
      const history=(await invoiceApi(env,'/invoices/'+invoice.invoice_id+'/comments')).comments;
      if(!Array.isArray(history))throw Error('Invoice history could not be read.');
      await rememberAttempt(env,job,{phase:'send',wasEmailed:invoice.is_emailed===true,history:history.map(x=>String(x.comment_id))});
      await invoiceApi(env,'/invoices/'+invoice.invoice_id+'/email?send_attachment=true',{to_mail_ids:[p.email],subject:'Your Leap birthday party invoice '+invoice.invoice_number,body:`<p>Thank you for completing your party-details form.</p><p>Your itemized invoice is attached. Remaining balance: <strong>${money(q.balanceCents)}</strong>. Payment is due <strong>${e(q.dueLabel)}</strong>.</p><p>Payment must be received by e-transfer to info@leapgymnastics.ca no later than the day before your party. Please include ${e(invoice.invoice_number)} in the transfer message. ${e(CANCELLATION_COPY)}</p>`});
      await sql(env,"UPDATE party_invoices SET status='sent',sent_at=?,error=NULL WHERE party_id=? AND fingerprint=?",Date.now(),p.id,job.fingerprint).run();
      invoicesSent++;
    }catch(error){await sql(env,"UPDATE party_invoices SET status='uncertain',error=? WHERE party_id=?",String(error.message).slice(0,200),p.id).run();}
  }
  return {invoicesSent};
}
