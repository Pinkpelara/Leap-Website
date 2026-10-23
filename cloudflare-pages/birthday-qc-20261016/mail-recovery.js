import {zoho} from './mail.js';
import {hash} from './security.js';
export const recoveryDelay=15*60*1000;
export async function mailReference(id){return 'LP'+(await hash(id)).slice(0,24);}
export async function sentMessage(env,reference){
 const rows=await zoho(env,`/accounts/${env.ZOHO_ACCOUNT_ID}/messages/search?`+new URLSearchParams({searchKey:'in:Sent::entire:'+reference,limit:'100',start:'1'}));
 if(!Array.isArray(rows)||rows.length>=100)throw Error('Mail search could not be reconciled');
 for(const row of rows){
  const message=await zoho(env,`/accounts/${env.ZOHO_ACCOUNT_ID}/folders/${row.folderId}/messages/${row.messageId}/content`);
  if(String(message?.content||'').includes(reference))return String(row.messageId);
 }
 return null;
}
export async function recoverMail(env){
 if(env.LEGACY_DELIVERY)return;
 const q=(s,...a)=>env.DB.prepare(s).bind(...a);
 const jobs=(await q("SELECT * FROM messages WHERE status IN ('uncertain','sending','render-error') AND attempted_at<? LIMIT 20",Date.now()-recoveryDelay).all()).results;
 for(const job of jobs){
  const tracked=await q('SELECT value FROM state WHERE key=?','mail-track:'+job.id).first();
  if(!tracked)continue; // Do not resend messages from an older release.
  try{
   const provider=await sentMessage(env,tracked.value);
   if(provider)await q("UPDATE messages SET status='sent',provider_id=?,sent_at=?,error=NULL WHERE id=? AND status IN ('uncertain','sending','render-error')",provider,Date.now(),job.id).run();
   else await q("UPDATE messages SET status='pending',due_at=?,error=NULL WHERE id=? AND status IN ('uncertain','sending','render-error')",Date.now(),job.id).run();
  }catch{ /* Provider unavailable: keep the job for the next scheduled check. */ }
 }
}
