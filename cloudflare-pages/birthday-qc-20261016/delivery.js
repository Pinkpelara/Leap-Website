import {emailFor,finish} from './emails.js';
import {send} from './mail.js';
import {mailReference,recoverMail} from './mail-recovery.js';
import {escape as e} from './security.js';

// Shared by both databases. Existing forms keep their original URLs and terms.
export async function deliverQueue(env) {
  const q=(s,...a)=>env.DB.prepare(s).bind(...a);
  const rows=async(s,...a)=>(await q(s,...a).all()).results;
  if(env.MAIL_MODE!=='live')return {sent:0,suppressed:true};
  if((await q("SELECT value FROM state WHERE key='automation_paused'").first())?.value==='1')return {sent:0,paused:true};
  await recoverMail(env);
  // Do not flood a family with every save they made while delivery was down.
  // Same-kind unsent receipts and reminder stages are superseded by the latest.
  await q(`UPDATE messages AS m SET status='skipped' WHERE status='pending'
    AND (kind='receipt' OR kind LIKE 'details-%') AND due_at<=?
    AND EXISTS(SELECT 1 FROM messages n WHERE n.party_id=m.party_id
      AND n.status='pending' AND n.due_at<=?
      AND ((m.kind='receipt' AND n.kind='receipt') OR (m.kind LIKE 'details-%' AND n.kind LIKE 'details-%'))
      AND (n.due_at>m.due_at OR (n.due_at=m.due_at AND n.id>m.id)))`,Date.now(),Date.now()).run();
  const jobs=await rows("SELECT * FROM messages WHERE status='pending' AND due_at<=? ORDER BY due_at LIMIT 30",Date.now());
  let sent=0;
  for(const job of jobs){
    const p=await q('SELECT * FROM parties WHERE id=?',job.party_id).first();
    if(!p||p.status!=='active'||finish(p)<Date.now()||(p.start_at<Date.now()&&(job.kind.startsWith('details-')||job.kind==='waivers'))||(job.kind.startsWith('details-')&&p.details)){
      await q("UPDATE messages SET status='skipped' WHERE id=? AND status='pending'",job.id).run();continue;
    }
    let mail,to=job.kind==='staff-prep'?'info@leapgymnastics.ca':p.email;
    const reference=env.LEGACY_DELIVERY?null:await mailReference(job.id);
    if(reference)await q('INSERT INTO state(key,value) VALUES(?,?) ON CONFLICT(key) DO NOTHING','mail-track:'+job.id,reference).run();
    try {
      if(job.kind.startsWith('consent-parent:')||job.kind.startsWith('consent-staff:')){
       const waiver=await q('SELECT * FROM waivers WHERE id=? AND party_id=?',job.kind.split(':')[1],p.id).first();
       if(!waiver)throw Error('Consent record not found');
       const record=JSON.parse(waiver.payload),isStaff=job.kind.startsWith('consent-staff:');
       to=isStaff?'info@leapgymnastics.ca':record.contactEmail;
       mail={subject:isStaff?'Birthday guest consent received':'Your Leap consent form has been received',content:isStaff?`<p>A guest consent form has been received for the party on ${e(new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',dateStyle:'full'}).format(p.start_at))}.</p><p><a href="${e(env.PUBLIC_ORIGIN)}/staff/">View party and guest consent records</a></p>`:`<p>Hi,</p><p>Thank you. We’ve received the consent form for ${e(waiver.child_name)} for the Leap birthday party on ${e(new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',dateStyle:'full'}).format(p.start_at))}.</p><p>You don’t need to submit it again. If you need to correct anything, reply to this email.</p><p>The Leap Gymnastics team</p>`};
      }else mail=await emailFor(env,p,job.kind);
    }
    catch {
      await q("UPDATE messages SET status='render-error',attempted_at=?,error='Email could not be prepared; automatic retry scheduled' WHERE id=? AND status='pending'",Date.now(),job.id).run();
      continue;
    }
    const claim=await q("UPDATE messages SET status='sending',attempted_at=? WHERE id=? AND status='pending' AND EXISTS(SELECT 1 FROM parties WHERE id=? AND status='active' AND updated_at=?)",Date.now(),job.id,p.id,p.updated_at).run();
    if(!claim.meta.changes)continue;
    try{
      const id=await send(env,to,mail.subject,mail.content+(reference?`<p style="font-size:12px;color:#666">Email reference: ${reference}</p>`:''));
      await q("UPDATE messages SET status='sent',sent_at=?,provider_id=?,error=NULL WHERE id=?",Date.now(),id,job.id).run();sent++;
    }catch{
      await q("UPDATE messages SET status='uncertain',error=? WHERE id=?",env.LEGACY_DELIVERY?'Check Zoho Sent before resending; acceptance not confirmed':'Delivery confirmation pending; automatic Sent check scheduled',job.id).run();
    }
  }
  return {sent};
}
