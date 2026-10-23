import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {default:router}=await import('../output/birthday-qc-20261016/existing-pages-router.mjs');
const response=await router.fetch(new Request('https://leap-birthday-party-form.pages.dev/birthday-display.js'));
assert.equal(response.status,200);
assert.equal(await response.text(),await fs.readFile(new URL('../cloudflare-pages/birthday-qc-20261016/birthday-display.js',import.meta.url),'utf8'));
assert.match(response.headers.get('content-type'),/javascript/);
console.log('PASS existing website script address serves reviewed calendar exactly');
