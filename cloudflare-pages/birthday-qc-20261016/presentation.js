import basic from './basic.html';
import premium from './premium.html';
import deluxe from './deluxe.html';
import {packageConfig,deadline} from './domain.js';
import {escape as e} from './security.js';
import {policyFor,formBillingHtml,PAYMENT_ACK} from './billing.js';
export const day=ms=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(ms);
export const time=ms=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',hour:'numeric',minute:'2-digit',hour12:true}).format(ms).replace(/a\.?m\.?/i,'a.m.').replace(/p\.?m\.?/i,'p.m.');
export const finish=p=>p.start_at+(packageConfig(p).gym+packageConfig(p).celebration)*60000;
export function formHtml(p){
 const config=packageConfig(p),end={Basic:'3:15',Premium:'3:30',Deluxe:'3:45'}[p.package];
 let html={Basic:basic,Premium:premium,Deluxe:deluxe}[p.package];
 // One pass: a real November 22 party date must not be replaced again as
 // the template's November 22 deadline.
 html=html.replace(/Sunday, November 29, 2026|Sunday, November 22/g,value=>e(day(value==='Sunday, November 29, 2026'?p.start_at:deadline(p))));
 const times=new Map([[`1:30–${end} p.m.`,e(time(p.start_at)+'–'+time(finish(p)))],[`${end} p.m.`,e(time(finish(p)))],['1:20 p.m.',e(time(p.start_at-600000))],['1:30 p.m.',e(time(p.start_at))]]);
 html=html.replace(/1:30–(?:3:15|3:30|3:45) p\.m\.|(?:1:20|1:30|3:15|3:30|3:45) p\.m\./g,value=>times.get(value)||value);
 const original={Basic:399,Premium:589,Deluxe:849}[p.package];
 html=html.replaceAll(`$${original} + HST`,`$${config.price} + HST`);
 if(deadline(p)<Date.now())html=html.replace(/Complete the form by <strong>.*?<\/strong> so we can prepare for your party\./,'Please send your details as soon as possible so we can prepare for your party.').replace(/Choose any extras by [^<]+\./,'The deadline for extras has passed. Please contact us if you need help with your selections.');
 if(policyFor(p)) {
   const oldPayment=/<h3>Payment<\/h3><p>Your \$113 deposit[\s\S]*?<\/p>/;
   if(!oldPayment.test(html)) throw Error('Payment paragraph changed; review the form before release.');
   html=html.replace(oldPayment,'');
   html=html.replace('<section><h2>Food and cake</h2>',formBillingHtml(p)+'<section><h2>Food and cake</h2>');
   html=html.replace('<p id="formError"',`<label class="choice"><input type="checkbox" name="paymentTerms" required>${e(PAYMENT_ACK)}</label><p id="formError"`);
   html=html.replace('You’ll receive a confirmation email.','You’ll receive a confirmation email and a separate invoice for your remaining balance.');
 }
 html=html.replace('<button type="submit">Submit party details</button>','<p>Save your progress to finish later. Choose Save and submit to send your details or changes to Leap.</p><button type="button" class="secondary" id="saveDraft">Save</button> <button type="submit">Save and submit</button>');
 return html;
}
