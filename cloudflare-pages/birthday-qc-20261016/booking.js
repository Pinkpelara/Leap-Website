import { Parser } from "htmlparser2";
import { torontoTime } from "./domain.js";
import {escape as e} from './security.js';
export function invoiceLines(html) {
  const lines = [];
  let current = "", skip = 0;
  const flush = () => {
    if (current.trim()) lines.push(current.replace(/\s+/g, " ").trim());
    current = "";
  };
  const parser = new Parser({ onopentag(name) {
    if (["script", "style"].includes(name)) skip++;
    if (["br", "td", "th", "p", "div", "tr", "li"].includes(name)) flush();
  }, ontext(text) {
    if (!skip) current += text;
  }, onclosetag(name) {
    if (["script", "style"].includes(name)) skip--;
    if (["td", "th", "p", "div", "tr", "li"].includes(name)) flush();
  } }, { decodeEntities: true });
  parser.write(html);
  parser.end();
  flush();
  return lines;
}
export function trusted(headers) {
  const entry = Object.entries(headers).find(([k]) => k.toLowerCase() === "authentication-results");
  const values = Array.isArray(entry?.[1]) ? entry[1] : [entry?.[1] || ""];
  const top = String(values[0]);
  return /^mx\.zohomailcloud\.ca\s*;/i.test(top) && /dkim=pass\s+header\.i=@leapgymnastics\.uplifterinc\.com(?:[;\s]|$)/i.test(top) && /dmarc=pass[^;]*header\.from=leapgymnastics\.uplifterinc\.com(?:[;\s]|$)/i.test(top);
}
export function verifiedDeposit(html,bookings){
  const lines=invoiceLines(html),start=lines.indexOf('Payment Details');
  if(bookings.length!==1||start<0)return null;
  const payment=lines.slice(start);
  if(!payment.includes('Transaction Amount')||!payment.includes('Paid')||payment.some(v=>/^(Refunded|Cancelled|Voided)$/i.test(v)))return null;
  const amounts=payment.filter(v=>/^\$[\d,]+\.\d{2}$/.test(v)).map(v=>Math.round(Number(v.replace(/[$,]/g,''))*100));
  if(amounts.length!==1||amounts[0]!==11300)return null;
  return {depositCents:11300,depositReference:'Uplifter invoice '+bookings[0].invoice};
}
export function isPastBirthdayReceipt(html,now=Date.now()){
  const lines=invoiceLines(html),occurrences=[];
  for(let i=0;i<lines.length;i++){
    const title=/^Birthday Parties\s*[-\u2013\u2014]\s*[A-Za-z]+\s+\d{4}(?:\s*(\[.*\]))?$/.exec(lines[i]);
    if(!title)continue;
    const date=/^\[(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2}\s*[AP]M)\]$/.exec(title[1]||lines[i+1]||'');
    // Every birthday item must have an exact dated occurrence. A monthly
    // catalogue title or an incomplete receipt cannot be classified as past.
    if(!date)return false;
    occurrences.push(torontoTime(date[1],date[2]));
  }
  return occurrences.length>0&&occurrences.every(start=>start<=now);
}
export function parseBooking(message, html, existing = []) {
  const invoice = /\bInvoice\s*#0*(\d+)\b/i.exec(message.subject || "")?.[1];
  if (!invoice) throw Error("Notification does not identify an invoice");
  const lines = invoiceLines(html);
  const occurrences = [];
  for (let i = 0; i < lines.length; i++) {
    // Uplifter renders the date in an inline span in real receipts. Older
    // receipts put it in a separate block. Accept both without joining rows.
    const title = /^Birthday Parties\s*[-\u2013\u2014]\s*[A-Za-z]+\s+\d{4}(?:\s*(\[.*\]))?$/.exec(lines[i]);
    if (!title) continue;
    const m = /^\[(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2}\s*[AP]M)\]$/.exec(title[1] || lines[i + 1] || "");
    if (m) occurrences.push({ start_at: torontoTime(m[1], m[2]), child_name: lines[i - 1] || "" });
  }
  if (occurrences.length !== 1) throw Error("Invoice must have exactly one identifiable birthday occurrence");
  const occurrence = occurrences[0];
  const end = lines.indexOf("Registration Details");
  if (end < 0) throw Error("Registration details section missing");
  const contacts = [...new Set(lines.slice(0, end).flatMap((l) => l.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig) || []).filter((v) => v.toLowerCase() !== "info@leapgymnastics.ca"))];
  if (contacts.length !== 1) throw Error("Booking contact is missing or ambiguous");
  const packageIndex = lines.findIndex((l) => ["Which birthday package would you like?", "Party Package"].includes(l));
  // Native checkout uses both “Basic Package” and “Deluxe - $849”.
  // Anchor to a known package and separator; never infer an absent answer.
  let packageMatch = /^(Basic|Premium|Deluxe)(?:\s+Package)?\s*(?:[-\u2013\u2014]|\$|$)/i.exec(lines[packageIndex + 1] || "");
  if(packageMatch)packageMatch[1]=packageMatch[1][0].toUpperCase()+packageMatch[1].slice(1).toLowerCase();
  // Some older receipts predate the package checkout question. Recover only
  // from the same stored invoice, contact and occurrence, never from a guess.
  const matched=existing.filter(p=>p.invoice===invoice&&p.email.toLowerCase()===contacts[0].toLowerCase()&&p.start_at===occurrence.start_at);
  const saved=matched.length===1?matched[0]:null;
  if((packageIndex<0&&!saved)||(packageIndex>=0&&!packageMatch))throw Error("Native package answer not present in receipt");
  if(!packageMatch&&saved)packageMatch=[null,saved.package];
  const enrolled = lines.indexOf("Enrolled at");
  const dt = /^([A-Za-z]{3}) (\d{1,2}), (\d{4}), (\d{1,2}:\d{2} [AP]M)$/.exec(lines[enrolled + 1] || "");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (!dt || !months.includes(dt[1])) throw Error("Booking timestamp missing");
  const booked_at = torontoTime(`${dt[3]}-${String(months.indexOf(dt[1]) + 1).padStart(2, "0")}-${dt[2].padStart(2, "0")}`, dt[4]);
  const paymentIndex = lines.indexOf("Payment Details");
  if (paymentIndex < 0) throw Error("Payment details section missing");
  const pay = lines.slice(paymentIndex);
  if (!pay.includes("Paid") || pay.some((l) => /^(Refunded|Cancelled|Voided)$/i.test(l))) throw Error("Paid booking could not be confirmed");
  const package_price=packageIndex<0 ? saved.confirmed_price : Number(/\$([\d,]+(?:\.\d{2})?)/.exec(lines[packageIndex+1])?.[1]?.replace(/,/g,""));
  const awaitingParentChoice=packageIndex<0&&saved?.package==='Pending';
  if(!awaitingParentChoice&&(!Number.isFinite(package_price)||package_price<=0))throw Error('Receipt package price could not be read');
  return { invoice, email: contacts[0].toLowerCase(), ...occurrence, booked_at, package: packageMatch[1], package_price:awaitingParentChoice?null:package_price };
}
export function parseBookings(message,html,existing=[]){
  const lines=invoiceLines(html),starts=[];
  for(let i=0;i<lines.length;i++)if(/^Birthday Parties\s*[-\u2013\u2014]\s*[A-Za-z]+\s+\d{4}(?:\s*\[.*\])?$/.test(lines[i]))starts.push(i);
  if(starts.length<=1)return [parseBooking(message,html,existing)];
  const reg=lines.indexOf('Registration Details'),payment=lines.indexOf('Payment Details');
  if(reg<0||payment<0||starts.some(i=>i<reg||i>=payment))throw Error('Birthday invoice sections could not be matched');
  const enrollment=lines.flatMap((s,i)=>s==='Enrolled at'?[lines[i+1]]:[]);
  const bookings=starts.map((start,index)=>{
    const section=lines.slice(start-1,index+1<starts.length?starts[index+1]-1:payment);
    if(!section.includes('Enrolled at')&&enrollment.length===1)section.push('Enrolled at',enrollment[0]);
    const fragment=[...lines.slice(0,reg+1),...section,...lines.slice(payment)].map(s=>'<div>'+e(s)+'</div>').join('');
    const booking=parseBooking(message,fragment);
    return {...booking,invoice:booking.invoice+':'+(index+1)};
  });
  if(new Set(bookings.map(p=>p.start_at)).size!==bookings.length)throw Error('Duplicate birthday occurrence on invoice; staff review required');
  return bookings;
}
