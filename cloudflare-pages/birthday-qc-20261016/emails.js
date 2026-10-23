import {packageConfig,deadline} from './domain.js';
import {escape as e,token} from './security.js';
import {day,time,finish as standardFinish} from './presentation.js';
import {policyFor,PAYMENT_COPY,FORM_PAYMENT_COPY,TRANSFER_COPY,dueLabel} from './billing.js';
// Older reservations can leave package selection to the existing parent form.
// Keep their original two-hour reservation window for delivery expiry only;
// do not invent package terms or display an unconfirmed finish time in email.
export const finish=p=>(p.package==='Pending'?p.start_at+120*60000:standardFinish(p))+(JSON.parse(p.extras||'{}').time?.status==='approved'?Number(JSON.parse(p.extras).time.minutes||0)*60000:0);
export async function links(env,p){return {
 host:`${env.PUBLIC_ORIGIN}/party/?party=${p.id}#host=${await token(env.TOKEN_SECRET,'host',p)}`,
 guest:`${env.GUEST_ORIGIN||env.PUBLIC_ORIGIN+'/consent'}/?party=${p.id}#guest=${await token(env.TOKEN_SECRET,'guest',p)}`
};}
export function packageCopy(p){
 if(p.package==='Pending')return 'Please choose your party package in your party form.';
 const c=packageConfig(p);
 const room=/no private party room/i.test(c.room)?'Your package includes a designated celebration area, with no private party room.':'You’ll have a private party room throughout your booking.';
 const balloons=p.package==='Basic'?' Balloon decorations are not included.':c.balloons?` Your decorations include ${c.balloons.charAt(0).toLowerCase()+c.balloons.slice(1)}.`:'';
 return `Your ${p.package} package is $${c.price} + HST and includes up to ${c.included} children, including the birthday child, ${c.gym} minutes of gymnastics and ${c.celebration} minutes for food, cake and celebrating. ${room}${c.newPolicy?' You have exclusive use of the gym.':''} Children’s tableware and cleanup are included.${balloons}${c.gift?` The birthday child receives ${c.gift.charAt(0).toLowerCase()+c.gift.slice(1)}.`:''}${p.package==='Deluxe'&&c.newPolicy?' A Cold Drink Station and one Mini Party Favour Bag per participating child are included.':''} Please bring your own food and cake.`;
}
function wrap(body){return `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#f7f6fa;color:#272037;font-family:Arial,sans-serif;font-size:16px;line-height:1.65"><div style="max-width:660px;margin:auto;padding:32px 24px;background:white"><p style="color:#61218b;font-weight:bold">LEAP GYMNASTICS</p>${body}<p>We look forward to celebrating with you!<br>The Leap Gymnastics team</p><hr><p style="font-size:13px">158 Anderson Ave., Units 3 &amp; 4, Markham<br><a href="mailto:info@leapgymnastics.ca">info@leapgymnastics.ca</a> · (289) 590-1111</p></div></body></html>`;}
export async function emailFor(env,p,kind){
 const l=await links(env,p),date=day(p.start_at);
 const action=`<p><a href="${e(l.host)}">View your party details</a></p>`;
 const waiver=`<p><a href="${e(l.guest)}">Complete a guest waiver</a></p>`;
 const sharing=`<p>Each child needs a waiver completed by their own parent or legal guardian. Please complete one for the birthday child and share the guest waiver link with the other families. You can use the “Copy guest waiver link” button on the waiver page.</p>${waiver}`;
 let subject,body;
 if(['booking','link','migration'].includes(kind)){
  subject=`Your birthday party at Leap — ${date}`;
  const due=deadline(p)>Date.now()?`Please complete your party form by <strong>${e(day(deadline(p)))}</strong>.`:'Please complete your party form as soon as possible so we can prepare for your celebration.';
  body=`<p>Hi,</p><p>Thank you for booking your birthday party at Leap!</p><p><strong>${e(date)}<br>${e(time(p.start_at))}${p.package==='Pending'?'':'–'+e(time(finish(p)))}</strong></p><p>${e(packageCopy(p))}</p><p>${due} Let us know your guest numbers, food plans and any extras you’d like.</p><p><a href="${e(l.host)}">Complete your party form</a></p>${sharing}<p>Your party-details link is just for you. Keep this email so you can update your answers and see which guest waivers we’ve received.</p>`;
  if(p.details)body=body.replace(`<p>${due} Let us know your guest numbers, food plans and any extras you’d like.</p>`,'<p>Your party details are saved. You can update your answers and guest list using the link below.</p>').replace('>Complete your party form</a>','>View your party details</a>');
  if(policyFor(p))body+=`<h2 style="font-size:20px">Deposit &amp; Payment</h2><p>${e(PAYMENT_COPY)}</p><p>${e(FORM_PAYMENT_COPY)}</p><p>${TRANSFER_COPY}</p><p><strong>Payment due: ${e(dueLabel(p))}</strong></p>`;
 }else if(kind==='receipt'){
  subject=`Thank you for your party details — ${date}`;
  body=`<p>Hi,</p><p>Thank you for sending us your party details. We’ve saved your answers for your celebration on <strong>${e(date)}</strong>.</p><p>You can use the link below to review your answers, update guest names and see which waivers we’ve received.</p>${action}${sharing}<p>If you have any questions or need help, reply to this email.</p>`;
  if(policyFor(p))body+=`<p>Your balance invoice will arrive in a separate email. If your changes don’t affect the cost, please use the invoice you already received.</p>`;
 }else if(kind.startsWith('details-')){
  subject=`A reminder to complete your party form — ${date}`;
  body=`<p>Hi,</p><p>We’re looking forward to your party on ${e(date)}. Please complete your party form ${deadline(p)>Date.now()?`by ${e(day(deadline(p)))}`:'as soon as you can'} so we can prepare for your guests.</p>${action}<p>If you need help, reply to this email and we’ll be happy to assist.</p>`;
 }else if(kind==='waivers'){
  subject=`Guest waivers for your party on ${date}`;
  body=`<p>Hi,</p><p>Your party is coming up! Please check the waiver list in your party details and send the guest waiver link to any families who still need to complete it.</p>${action}${sharing}<p>If a name looks different from your guest list, reply to this email so we can check it for you.</p>`;
 }else if(kind==='extras'){
  const requestNames={theme:'Themed balloon decorations',time:'Additional party time'};
  const requests=Object.entries(JSON.parse(p.extras||'{}')).filter(([key,x])=>requestNames[key]&&['approved','declined','pending'].includes(x?.status));
  if(!requests.length)throw Error('No customer-facing extra request to report');
  subject=`An update about your party on ${date}`;
  body=`<p>Hi,</p><p>Here’s an update on your party requests:</p><ul>${requests.map(([key,x])=>`<li>${requestNames[key]}: ${e({approved:'confirmed',declined:'not available',pending:'we’re checking availability'}[x.status])}</li>`).join('')}</ul>${action}<p>If you have any questions, please reply to this email.</p>`;
 }else if(kind==='staff-prep'){
  return {subject:`Birthday preparation: invoice ${p.invoice}`,content:`<p>Party details for ${e(date)} are ready to review.</p><p><a href="${e(env.PUBLIC_ORIGIN)}/staff/">Open birthday preparation</a></p>`};
 }else throw Error('Unrecognized email kind');
 return {subject,content:wrap(body)};
}
