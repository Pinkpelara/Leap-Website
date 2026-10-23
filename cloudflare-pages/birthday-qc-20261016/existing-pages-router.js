import assets from './legacy-assets.generated.json';
import {restrictPackageChoices,isRestrictedParty} from './legacy-package-availability.js';
// Preserve the October 6 backend at its immutable deployment URL. Reviewed
// form assets and the website calendar script are served at their existing
// addresses; private links and API requests keep their original backend.
const previous='https://698fc0f4.leap-birthday-party-form.pages.dev';
const current='https://leap-birthday-bookings.pourkamali.workers.dev';
export default {async fetch(req){
 const url=new URL(req.url);
 const asset=assets[['/party','/party/'].includes(url.pathname)?'/party.html':url.pathname];
 if(asset)return new Response(asset.content,{headers:{'Content-Type':asset.type,'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'}});
 if(['/', '/entry', '/entry.html'].includes(url.pathname)&&!url.searchParams.has('party'))return new Response(null,{status:302,headers:{Location:current+'/', 'Cache-Control':'no-store'}});
 const target=new URL(url.pathname+url.search,previous);
 if(url.pathname==='/api/party' && isRestrictedParty(url.searchParams.get('party')) && req.method==='POST'){
  let input;try{input=await req.clone().json();}catch{}
  if(input?.package==='Deluxe'){
   const lookup=await fetch(new Request(target,{headers:req.headers,method:'GET'}),{redirect:'manual'});
   if(!lookup.ok)return lookup;
   const party=restrictPackageChoices(await lookup.json());
   if(party.unavailablePackages?.includes('Deluxe'))return Response.json({error:party.packageAvailabilityNote},{status:422,headers:{'Cache-Control':'no-store'}});
  }
 }
 const response=await fetch(new Request(target,req),{redirect:'manual'});
 if(url.pathname==='/api/party' && req.method==='GET' && response.ok && isRestrictedParty(url.searchParams.get('party'))){
  const headers=new Headers(response.headers);headers.set('Cache-Control','no-store');headers.delete('Content-Length');headers.delete('Content-Encoding');headers.delete('ETag');
  return Response.json(restrictPackageChoices(await response.json()),{status:response.status,headers});
 }
 const headers=new Headers(response.headers);
 const location=headers.get('Location');
 if(location){const dest=new URL(location,target);if(dest.origin===previous){dest.protocol=url.protocol;dest.host=url.host;headers.set('Location',dest.href);}}
 return new Response(response.body,{status:response.status,headers});
}};
