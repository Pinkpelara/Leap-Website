// Payment ends with the invoice and e-transfer. Keep the existing custom CMS
// payment paragraphs consistent without changing links or any booking terms.
(function(){
 function paymentCopy(){
  document.querySelectorAll('p').forEach(function(p){
   var walk=document.createTreeWalker(p,NodeFilter.SHOW_TEXT),node;
   while((node=walk.nextNode()))if(node.nodeValue.indexOf('A receipt will be emailed once payment is confirmed.')!==-1)node.nodeValue=node.nodeValue.replace('A receipt will be emailed once payment is confirmed. ','').replace('A receipt will be emailed once payment is confirmed.','');
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',paymentCopy,{once:true});else paymentCopy();
})();
(function(){
'use strict';
if(!/^\/registration\/product-detail\/BDAY-(2026-(10|11|12)|2027-0[1-6])\/?$/.test(window.location.pathname))return;
function update(){
var cell=Array.from(document.querySelectorAll('td[colspan="2"]')).find(function(td){return /^Description:/.test(td.textContent.trim());});
if(!cell)return;
var paragraphs=Array.from(cell.querySelectorAll('p'));
paragraphs.forEach(function(p){var text=p.textContent.trim();
if(text.indexOf('Choose your party date and package, then pay')===0){p.innerHTML=p.innerHTML.replace('reserve your two-hour party','reserve your party');}
else if(text.indexOf('Basic: $350')===0){p.textContent='New bookings: Basic $399 + HST (10 children, 1 hour 45 minutes), Premium $589 + HST (16 children, 2 hours), or Deluxe $849 + HST (22 children, 2 hours 15 minutes). Counts include the birthday child. Basic additional children are $25 each above 10, maximum 16 total; Premium additional children are $25 each above 16, maximum 22 total. Deluxe includes up to 22; additional children are not available. Existing bookings retain their confirmed price, inclusions and party time.';}
else if(text.indexOf('Deluxe includes a cheerful balloon bouquet')===0){p.innerHTML='<a href="/birthday-parties/#party-packages">Compare all package inclusions and available extras</a>.';}
else if(text.indexOf("Kids' Drink Station")===0){p.textContent='Cold Drink Station: A selection of juice, soft drinks and bottled water for children and adults. Selection varies based on availability. Included with Deluxe; + $40 with Premium; unavailable with Basic.';var next=p.nextElementSibling;if(next && next.tagName==='UL')next.remove();}
else if(text.indexOf('(Offerings vary based on current availability)')===0)p.remove();
else if(text.indexOf('We no longer offer themed upgrades or additional party time.')===0){p.innerHTML=p.innerHTML.replace('We no longer offer themed upgrades or additional party time. ','');}
});
Array.from(document.querySelectorAll('tr')).forEach(function(row){var cells=row.querySelectorAll('th,td');if(cells.length!==2)return;var label=cells[0].textContent.trim();if(label.indexOf('Day / Time:')!==-1)cells[1].textContent='New bookings: Saturdays and Sundays beginning at 1:30 p.m. Basic finishes at 3:15 p.m., Premium at 3:30 p.m. and Deluxe at 3:45 p.m. Existing bookings retain their confirmed times.' + (/BDAY-2026-11\/?$/.test(location.pathname) ? ' Additional November 21 slot at 3:30 p.m.: Basic ends at 5:15 p.m., Premium at 5:30 p.m. and Deluxe at 5:45 p.m.' : '');if(label.indexOf('Drop In:')!==-1){var labelNode=cells[0].querySelector(".icon-dropin")||cells[0];var nodes=Array.from(labelNode.childNodes);nodes.forEach(function(n){if(n.nodeType===3)n.textContent=n.textContent.replace('Drop In:','Availability:');});}});
}

function updateModal(){
var modal=document.getElementById('editOrderItemModal');if(!modal||!modal.offsetHeight||!modal.querySelector('h2')||modal.querySelector('h2').textContent.indexOf('Birthday Parties')!==0)return false;
modal.querySelectorAll('li.tab .title').forEach(function(label){if(label.textContent.trim()==='Drop In')label.textContent='Availability / Book';});
var time=modal.querySelector('[title="Time"]');if(time)time.textContent='New bookings begin at 1:30 p.m. Basic finishes at 3:15 p.m., Premium at 3:30 p.m., Deluxe at 3:45 p.m. Existing bookings retain confirmed times.' + (/BDAY-2026-11\/?$/.test(location.pathname) ? ' Additional November 21 slot at 3:30 p.m.: Basic ends at 5:15 p.m., Premium at 5:30 p.m. and Deluxe at 5:45 p.m.' : '');
modal.querySelectorAll('.checkboxField.canRegister').forEach(function(row){var start=row.querySelector('[data-bind="text: event_start_time.date(TIME_ONLY)"]');var end=row.querySelector('[data-bind="text: event_end_time.date(TIME_ONLY)"]');if(start&&end&&!row.dataset.leapPartyTime){start.textContent=start.textContent+' start';end.hidden=true;if(end.previousSibling&&end.previousSibling.nodeType===3)end.previousSibling.textContent='';row.dataset.leapPartyTime='1';}});
return !!modal.querySelector('.checkboxField');
}
document.addEventListener('click',function(event){if(!event.target.closest('form.addToCartAjax'))return;var observer=new MutationObserver(function(){if(updateModal())observer.disconnect();});observer.observe(document.body,{childList:true,subtree:true});setTimeout(function(){observer.disconnect();},10000);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});else update();
})();

/* Custom live birthday dates, October 6 2026 */
function leapBirthdayAvailabilityInit() {
  'use strict';
  var root = document.querySelector('[data-leap-party-availability]');
  if (!root || root._leapPartyAvailabilityReady) return;
  root._leapPartyAvailabilityReady = true;
  var calendar = root.dataset.leapPartyAvailability === 'calendar';
  var months = [], selected = 0, generation = 0, controller, started = false;
  var monthSelect = root.querySelector('select');
  var refreshButton=root.querySelector('[data-party-refresh]');
  monthSelect.disabled=true;if(refreshButton)refreshButton.disabled=true;
  var status = root.querySelector('[data-party-status]');
  var output = root.querySelector('[data-party-dates]');
  var detail = root.querySelector('[data-party-detail]');
  var fmt = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'});
  function dayKey(seconds) { return fmt.format(new Date(Number(seconds) * 1000)); }
  function state(e, now) {
    if (e.spots_dropin === null || e.spots_dropin === undefined || e.spots_dropin === '' || !Number.isFinite(Number(e.spots_dropin))) return 'Check availability';
    if (Number(e.spots_dropin) <= 0) return 'Full';
    if (Number(e.event_start_time) <= now) return 'Past';
    if (Number(e.registration_start_time) > now || Number(e.program_registration_start_time) > now) return 'Not yet open';
    if ((Number(e.registration_cutoff) > 0 && now >= Number(e.registration_cutoff)) ||
        (Number(e.program_registration_cutoff) > 0 && now >= Number(e.program_registration_cutoff)) ||
        now >= Number(e.event_start_time) - 7 * 86400) return 'Booking closed';
    return 'Available';
  }
  function element(tag, text, cls) {
    var el = document.createElement(tag); if (text !== undefined) el.textContent = text;
    if (cls) el.className = cls; return el;
  }
  function link(text, url) { var el=element('a',text,'lp-book');el.href=url;el.target='_top';return el; }
  function dateLabel(e) { return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',weekday:'long',month:'long',day:'numeric'}).format(new Date(Number(e.event_start_time)*1000)); }
  function timeLabel(e) { return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',hour:'numeric',minute:'2-digit'}).format(new Date(Number(e.event_start_time)*1000)); }
  function render(events, month) {
    var now=Date.now()/1000, seen=new Set();
    events=events.filter(function(e){var key=String(e.event_id||e.id);if(e.sku!==month.sku||Number(e.program_id)!==month.id||dayKey(e.event_start_time).slice(0,7)!==month.key||seen.has(key))return false;seen.add(key);return true;}).sort(function(a,b){return a.event_start_time-b.event_start_time;});
    output.replaceChildren(); detail.replaceChildren();
    if (!calendar) {
      var list=element('ul',undefined,'lp-date-list');
      events.filter(function(e){return Number(e.event_start_time)>now;}).forEach(function(e){
        var label=state(e,now),li=element('li'),copy=element('span');copy.append(element('strong',dateLabel(e)),element('small',timeLabel(e)));
        li.append(copy,label==='Available'?link('Available / Book',month.url):element('span',label,'lp-status '+(label==='Full'?'lp-full':'')));list.append(li);
      });output.append(list);
    } else {
      var grid=element('div',undefined,'lp-month-grid');
      ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function(d){grid.append(element('span',d,'lp-weekday'));});
      var parts=month.key.split('-').map(Number),offset=new Date(Date.UTC(parts[0],parts[1]-1,1)).getUTCDay(),count=new Date(Date.UTC(parts[0],parts[1],0)).getUTCDate();
      for(var n=0;n<offset;n++)grid.append(element('span'));
      for(var d=1;d<=count;d++){
        var key=month.key+'-'+String(d).padStart(2,'0'),dayEvents=events.filter(function(e){return dayKey(e.event_start_time)===key;});
        var open=dayEvents.filter(function(e){return state(e,now)==='Available';}),label=open.length?'Available':dayEvents.length?state(dayEvents[0],now):'Not offered';
        var cell=element(open.length?'button':'span',undefined,'lp-day '+(open.length?'lp-open':label==='Full'?'lp-full':'lp-unavailable'));
        cell.append(element('strong',String(d)),element('small',label==='Available'?'Open':label==='Full'?'Full':dayEvents.length?'Closed':'—'));
        cell.setAttribute('aria-label',key+', '+label);
        if(open.length){cell.type='button';cell.addEventListener('click',(function(es){return function(){detail.replaceChildren();es.forEach(function(e){var line=element('div',undefined,'lp-selection');line.append(element('p',dateLabel(e)+' at '+timeLabel(e)),link('Book this date',month.url));detail.append(line);});detail.append(element('small','Choose this date on the registration page. Availability is confirmed at checkout.'));};})(open));}
        grid.append(cell);
      }output.append(grid);
    }
    var available=events.filter(function(e){return state(e,now)==='Available';}).length;
    status.textContent=available?available+' available party date'+(available===1?'':'s')+'. Updated from registration.':'No available party dates this month. Try another month.';
    if(!calendar && !output.querySelector('li')) output.append(element('p','No upcoming party dates listed for this month.'));
    return available;
  }
  async function load() {
    if(!months.length)return; var seq=++generation,month=months[selected];
    if(controller)controller.abort();controller=new AbortController();
    status.textContent='Checking live availability…';output.replaceChildren();detail.replaceChildren();root.setAttribute('aria-busy','true');
    var timer=setTimeout(function(){controller.abort();},15000);
    try {
      var productResponse=await fetch(month.url+'?priceDisplayMode=total',{credentials:'omit',cache:'no-store',signal:controller.signal,headers:{Accept:'application/json','X-Requested-With':'XMLHttpRequest'}});
      if(!productResponse.ok)throw Error('Program unavailable');
      var product=(await productResponse.json()).product;
      if(!product||product.status!=='Public'||Number(product.deleted)||Number(product.program_id)!==month.id||product.sku!==month.sku)throw Error('Program unpublished');
      var parts=month.key.split('-').map(Number),url=new URL('/calendar/',location.origin);
      url.searchParams.set('action','FetchCalendarData');url.searchParams.set('calendarAction','fetchEvents');url.searchParams.append('program[]',String(month.id));
      url.searchParams.set('show_hidden','true');
      var body=new URLSearchParams({start:String(Date.UTC(parts[0],parts[1]-1,1)/1000-86400),end:String(Date.UTC(parts[0],parts[1],1)/1000+86400)});
      var response=await fetch(url.href,{method:'POST',credentials:'omit',cache:'no-store',signal:controller.signal,headers:{Accept:'application/json','X-Requested-With':'XMLHttpRequest','Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},body:body.toString()});
      if(!response.ok)throw Error('Feed unavailable');var data=await response.json();if(!Array.isArray(data))throw Error('Invalid feed');
      if(seq===generation)return render(data,month);
    }catch(e){if(seq===generation){status.textContent='Live availability is temporarily unavailable.';output.replaceChildren(link('Check dates on registration',month.url));}}
    finally{clearTimeout(timer);if(seq===generation)root.removeAttribute('aria-busy');}
  }
  async function catalog(){
      var oldKey=months[selected]&&months[selected].key;
      var r=await fetch('/registration/?_party_dates='+Date.now(),{credentials:'omit',cache:'no-store'});if(!r.ok)throw Error();var doc=new DOMParser().parseFromString(await r.text(),'text/html');
      var today=fmt.format(new Date()).slice(0,7),seen=new Set();
      var candidates=[];
      doc.querySelectorAll('#birthday-party-booking-months a[data-program-id]').forEach(function(a){var u=new URL(a.getAttribute('href'),location.origin),match=u.pathname.match(/\/registration\/product-detail\/(BDAY-(\d{4}-\d{2}))\/?$/);if(!match||u.origin!==location.origin||match[2]<today||seen.has(match[1]))return;seen.add(match[1]);candidates.push({sku:match[1],key:match[2],id:Number(a.dataset.programId),url:u.pathname});});
      if(!candidates.length)throw Error();
      var checked=await Promise.all(candidates.map(async function(m){try{var response=await fetch(m.url+'?priceDisplayMode=total',{credentials:'omit',cache:'no-store',headers:{Accept:'application/json','X-Requested-With':'XMLHttpRequest'}});if(!response.ok)return null;var p=(await response.json()).product;return p&&p.status==='Public'&&!Number(p.deleted)&&Number(p.program_id)===m.id&&p.sku===m.sku?m:null;}catch(e){return null;}}));
      months=checked.filter(Boolean).sort(function(a,b){return a.key.localeCompare(b.key);});if(!months.length)throw Error();
      selected=Math.max(0,months.findIndex(function(m){return m.key===oldKey;}));monthSelect.replaceChildren();
      months.forEach(function(m,i){var label=new Intl.DateTimeFormat('en-CA',{timeZone:'UTC',month:'long',year:'numeric'}).format(new Date(m.key+'-15T12:00:00Z'));var o=element('option',label);o.value=String(i);monthSelect.append(o);});monthSelect.disabled=false;
      monthSelect.value=String(selected);
  }
  async function init(){
    if(started)return;started=true;
    try{
      await catalog();
      monthSelect.disabled=true;
      var available=await load();
      while(available===0&&selected<months.length-1){selected++;monthSelect.value=String(selected);available=await load();}
      monthSelect.disabled=false;if(refreshButton)refreshButton.disabled=false;
      monthSelect.addEventListener('change',function(){selected=Number(monthSelect.value);load();});refreshButton.addEventListener('click',load);
      setInterval(async function(){var rect=root.getBoundingClientRect();if(!document.hidden&&rect.bottom>0&&rect.top<innerHeight){try{await catalog();await load();}catch(e){status.textContent='Live availability is temporarily unavailable. Please check registration.';output.replaceChildren();detail.replaceChildren();}}},60000);
    }catch(e){status.textContent='Please check party dates on registration.';if(refreshButton){refreshButton.disabled=false;refreshButton.onclick=function(){started=false;init();};}}
  }
  if('IntersectionObserver' in window){var observer=new IntersectionObserver(function(entries){if(entries.some(function(e){return e.isIntersecting;})){observer.disconnect();init();}},{rootMargin:'200px'});observer.observe(root);}else init();
}
if(document.readyState === "loading"){document.addEventListener("DOMContentLoaded",leapBirthdayAvailabilityInit,{once:true});}else{leapBirthdayAvailabilityInit();}
