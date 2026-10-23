import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src=path.join(root,'cloudflare-pages/birthday-qc-20261016'),out=path.join(root,'output/birthday-qc-20261016');
await fs.mkdir(out,{recursive:true});
const require=createRequire(import.meta.url);
const assets=JSON.parse(await fs.readFile(path.join(src,'assets.generated.json'),'utf8'));
for(const name of ['entry.html','entry.js','party.html','party.js','parent.css','staff.html','staff.js','connected.css','domain.js','security.js','billing.js','invoice-preview.css','birthday-display.js','consent/index.html','consent/app.js','consent/styles.css']){
 let content=await fs.readFile(path.join(src,name),'utf8');
 if(name==='consent/index.html')content=content.replace('href="/styles.css"','href="/consent/styles.css"').replace('src="/app.js"','src="/consent/app.js"');
 assets['/'+name]={content,type:name.endsWith('.html')?'text/html; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8'};
}
await fs.writeFile(path.join(src,'assets.generated.json'),JSON.stringify(assets));
// Keep the website's existing shared script address working without changing
// hidden global CMS content or loading two competing calendar scripts.
const legacyAssets=JSON.parse(await fs.readFile(path.join(src,'legacy-assets.generated.json'),'utf8'));
for(const name of ['party.html','party.js'])legacyAssets['/'+name]={...legacyAssets['/'+name],content:await fs.readFile(path.join(src,'legacy',name),'utf8')};
legacyAssets['/birthday-display.js']=assets['/birthday-display.js'];
await fs.writeFile(path.join(src,'legacy-assets.generated.json'),JSON.stringify(legacyAssets));
const options={bundle:true,format:'esm',target:'es2022',loader:{'.html':'text'}};
await require('esbuild').build({...options,entryPoints:[path.join(src,'entry-worker.js')],outfile:path.join(out,'worker.mjs'),platform:'browser'});
await require('esbuild').build({...options,entryPoints:[path.join(src,'existing-pages-router.js')],outfile:path.join(out,'existing-pages-router.mjs'),platform:'browser'});
await require('esbuild').build({...options,entryPoints:[path.join(root,'tools/test_birthday_qc_20261016.mjs')],outfile:path.join(out,'test.mjs'),platform:'node'});
await require('esbuild').build({...options,entryPoints:[path.join(root,'tools/test_birthday_qc_forms_20261016.mjs')],outfile:path.join(out,'test-forms.mjs'),platform:'node'});
await require('esbuild').build({...options,entryPoints:[path.join(root,'tools/test_birthday_qc_invoices_20261016.mjs')],outfile:path.join(out,'test-invoices.mjs'),platform:'node'});
console.log('Local review bundle built. Nothing published.');
