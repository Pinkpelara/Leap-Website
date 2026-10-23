import app from './worker.js';
import assets from './assets.generated.json';
function withAssets(env){return {...env,ASSETS:{async fetch(req){let p=new URL(req.url).pathname;if(p==='/consent'||p==='/consent/')p='/consent/index.html';const a=assets[p];if(!a)return new Response('Not found',{status:404});return new Response(a.binary?Uint8Array.from(atob(a.content),c=>c.charCodeAt(0)):a.content,{headers:{'Content-Type':a.type,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});}}};}
export default {fetch(req,env,ctx){return app.fetch(req,withAssets(env),ctx);},scheduled(event,env,ctx){return app.scheduled(event,withAssets(env),ctx);}};
