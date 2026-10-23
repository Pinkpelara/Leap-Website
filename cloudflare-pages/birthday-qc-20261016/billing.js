import {packageConfig,torontoTime} from './domain.js';
import {escape as e} from './security.js';
export const POLICY = 'invoice-day-before-v1-draft';
export const CANCELLATION_COPY = 'If your invoice remains unpaid after the due date, your party booking may be cancelled.';
export const PAYMENT_COPY = 'Please book at least seven days in advance and choose your date and package at checkout. A $100 deposit plus HST ($113) is required to reserve your party and is applied toward the total cost.';
export const FORM_PAYMENT_COPY = 'Complete your party-details form at least seven days before your party. Your remaining balance will be shown before you submit. Once you submit the form, an itemized invoice will automatically be emailed to you, including HST and selected add-ons, with your deposit deducted.';
export const TRANSFER_COPY = 'Payment must be received by e-transfer to <a href="mailto:info@leapgymnastics.ca">info@leapgymnastics.ca</a> no later than the day before your party. Please include your invoice number in the transfer message. ' + CANCELLATION_COPY;
export const LATE_COPY = 'Late-departure fees, if any, are paid separately by e-transfer at the end of the party.';
export const PAYMENT_ACK = 'I understand that payment is due the day before my party and that my booking may be cancelled if payment is overdue.';
export const policyFor = p => JSON.parse(p.extras || '{}').booking?.billing?.policy === POLICY;
export const money = cents => new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(cents/100);
const dateOnly = ms => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(ms);
export function dueDate(p) {
  const date = new Date(dateOnly(p.start_at)+'T12:00:00Z');
  date.setUTCDate(date.getUTCDate()-1);
  return date.toISOString().slice(0,10);
}
export const dueLabel = p => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(torontoTime(dueDate(p),'12:00 PM'));
export const policyText = p => `Please pay by ${dueLabel(p)}, the day before your party. ${CANCELLATION_COPY}`;
export function quote(p,details) {
  const c=packageConfig(p),b=JSON.parse(p.extras||'{}').booking?.billing;
  if(!policyFor(p)) throw Error('Existing booking: keep its agreed payment terms.');
  if(!c?.newPolicy) throw Error('This package needs a billing review.');
  const n=Number(details.children),bags=Number(details.loot||0);
  if(!Number.isInteger(n)||n<1||n>c.maxChildren) throw Error('Enter the number of participating children to see your total.');
  if(!Number.isInteger(bags)||bags<0||bags>22||(p.package==='Deluxe'&&bags)) throw Error('Please check the Mini Party Favour Bag quantity.');
  if(details.beverages && p.package!=='Premium') throw Error('Please check the drink station selection.');
  if(details.extraMinutes || details.theme || details.themed) throw Error('An existing special arrangement needs a billing review.');
  if(!Number.isSafeInteger(b?.depositCents)||b.depositCents<0||!b.depositReference) throw Error('Leap needs to verify the deposit before issuing the invoice.');
  if(b.discountReview || b.adjustmentReview) throw Error('Leap needs to check the booking adjustment before issuing the invoice.');
  const lines=[{key:'package',description:`${p.package} birthday package`,quantity:1,rateCents:Math.round(c.price*100)}];
  if(n>c.included) lines.push({key:'children',description:'Additional participating children',quantity:n-c.included,rateCents:Math.round(c.extraChild*100)});
  if(bags) lines.push({key:'favours',description:'Mini Party Favour Bags',quantity:bags,rateCents:700});
  if(details.beverages) lines.push({key:'drinks',description:'Cold Drink Station',quantity:1,rateCents:4000});
  for(const line of lines) line.amountCents=line.quantity*line.rateCents;
  const subtotalCents=lines.reduce((n,l)=>n+l.amountCents,0),taxCents=Math.round(subtotalCents*13/100),totalCents=subtotalCents+taxCents;
  if(b.depositCents>totalCents) throw Error('Leap needs to review the payment credit.');
  return {currency:'CAD',lines,subtotalCents,taxCents,totalCents,depositCents:b.depositCents,balanceCents:totalCents-b.depositCents,dueDate:dueDate(p),dueLabel:dueLabel(p),policy:POLICY};
}
export function quoteHtml(q) {
  return `<table class="invoice-lines"><caption>Invoice summary</caption><thead><tr><th scope="col">Description</th><th scope="col">Amount</th></tr></thead><tbody>${q.lines.map(l=>`<tr><td>${e(l.description)}${l.quantity>1?` (${l.quantity} at ${money(l.rateCents)})`:''}</td><td>${money(l.amountCents)}</td></tr>`).join('')}<tr><td>Subtotal</td><td>${money(q.subtotalCents)}</td></tr><tr><td>HST (13%)</td><td>${money(q.taxCents)}</td></tr><tr><td>Total including HST</td><td>${money(q.totalCents)}</td></tr><tr><td>Deposit paid (including HST)</td><td>-${money(q.depositCents)}</td></tr><tr class="balance"><th scope="row">Remaining balance</th><td>${money(q.balanceCents)}</td></tr></tbody></table><p><strong>Payment due: ${e(q.dueLabel)}</strong></p>`;
}
export function formBillingHtml(p) {
  return `<section id="party-payment"><h2>Deposit &amp; Payment</h2><p>${e(PAYMENT_COPY)}</p><p>${e(FORM_PAYMENT_COPY)}</p><p>${TRANSFER_COPY}</p><div id="billingSummary" aria-live="polite"></div></section>`;
}
export function agreementFor(p,agreements) {
  return policyFor(p)?[...agreements,{key:'paymentTerms',text:PAYMENT_ACK}]:agreements;
}
// This is an exception flag, not an automatic cancellation action.
export function cancellationReview(p,billing,now) {
  const partyDayStart=torontoTime(dateOnly(p.start_at),'12:00 AM');
  if(!policyFor(p)||p.status!=='active'||now<partyDayStart) return 'none';
  if(!billing?.deliveredAt||!billing.checkedAt||now-billing.checkedAt>5*60000||billing.transferPending||!Number.isSafeInteger(billing.balanceCents)||billing.balanceCents<0) return 'verify_payment';
  return billing.balanceCents===0?'paid':'confirm_cancellation';
}
