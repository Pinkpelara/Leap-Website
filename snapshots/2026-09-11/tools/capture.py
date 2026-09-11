import argparse
import requests,bs4,re,json,hashlib,datetime,time,concurrent.futures,urllib.parse as U,pathlib,collections,html,traceback
parser=argparse.ArgumentParser(description='Capture the currently published Leap public website without authentication.')
parser.add_argument('--output',default='leap-public-snapshot-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d-%H%M%S'))
parser.add_argument('--browser-resources',help='Optional JSON array of anonymous browser-observed static URLs. Tracking and redacted URLs are ignored.')
args=parser.parse_args()
ROOT=pathlib.Path(args.output).resolve()
ROOT.mkdir(parents=True,exist_ok=True)
BASE='https://www.leapgymnastics.ca'
START=datetime.datetime.now(datetime.timezone.utc).isoformat()
HEADERS={'User-Agent':'Mozilla/5.0 (compatible; LeapAuthorizedPublicArchive/1.0)','Accept-Language':'en-CA,en;q=0.9'}
manifest={};omissions={};links=[];metadata=[];sanitizations=[];page_pending=set();asset_pending=set();page_done=set();asset_done=set();discovered={};redirects=[]
DENY=re.compile(r'/(?:admin|uSimpleCMSAdmin|login|logout|account|my-account|checkout|cart|shoppingcart|ajax|api|password|reset-password|register-user|sign-up)(?:/|$)|/pages/(?:u[A-Z]|.*(?:getRevision|revision))|/(?:add|remove|delete|update|save|submit)(?:/|$)',re.I)
EXT=re.compile(r'\.(?:css|m?js|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot|pdf|mp4|webm|mp3|ogg|json)(?:$|\?)',re.I)
ASSET_EXTS={'.css','.js','.mjs','.png','.jpg','.jpeg','.gif','.webp','.avif','.svg','.ico','.woff','.woff2','.ttf','.otf','.eot','.pdf','.mp4','.webm','.mp3','.ogg','.json'}
NO_EXTERNAL=re.compile(r'googletagmanager|google-analytics|facebook\.com|connect\.facebook|recaptcha|google\.com/recaptcha|doubleclick|clarity\.ms|cloudflareinsights|hotjar|youtube\.com|youtu\.be|maps\.google|google\.com/maps',re.I)
SAFE_TYPES=('text/css','javascript','image/','font/','application/font','application/pdf','application/json','application/xml','text/plain','video/','audio/','application/octet-stream','application/vnd.ms-fontobject')
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def jswrite(path,data):
 p=ROOT/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def normalize(value,base,asset=False):
 if not value:return None
 v=html.unescape(str(value)).strip().replace('\\/','/')
 if v.startswith(('data:','blob:','javascript:','mailto:','tel:','#','about:')):return None
 if any(c in v for c in ['\n','\r','{','}','<','>']):return None
 x=U.urlsplit(U.urljoin(base,v))
 if x.scheme not in ['http','https']:return None
 host=x.netloc.lower()
 if host in ['leapgymnastics.ca','www.leapgymnastics.ca']:host='www.leapgymnastics.ca'
 q=[]
 for k,val in U.parse_qsl(x.query,keep_blank_values=True):
  if k.isdigit() or k.startswith('utm_') or (asset and k in ['v','ver','version','cache','_'] and re.fullmatch(r'[\d.]+',val)):continue
  if not asset and k in ['sort','page','month','year','view','calendar']:continue
  q.append((k,val))
 return U.urlunsplit(('https' if host=='www.leapgymnastics.ca' else x.scheme,host,x.path or '/',U.urlencode(q),''))
def omit(url,reason,source):
 key=(url,reason)
 if key not in omissions:omissions[key]={'url':url,'reason':reason,'discoveredOn':source}
def same(url):return U.urlsplit(url).netloc=='www.leapgymnastics.ca'
def allowed_page(url):
 x=U.urlsplit(url)
 if not same(url):return False,'external link (inventoried, not crawled as site content)'
 if DENY.search(U.unquote(x.path)) and x.path!='/ajax/cookies.php':return False,'account, admin, action or transactional route excluded'
 if x.query:return False,'query variant excluded; canonical content route captured where linked'
 if pathlib.PurePosixPath(x.path).suffix.lower() in ASSET_EXTS:return False,'asset'
 return True,''
def queue_page(raw,source):
 url=normalize(raw,source)
 if not url:return
 ok,reason=allowed_page(url)
 if ok:
  discovered.setdefault(url,set()).add(source)
  if url not in page_done:page_pending.add(url)
 elif reason=='asset':queue_asset(raw,source)
 else:omit(url,reason,source)
def queue_asset(raw,source):
 url=normalize(raw,source,True)
 if not url:return
 if NO_EXTERNAL.search(url):omit(url,'third-party tracking, captcha or embedded-service dependency not downloaded',source);return
 if DENY.search(U.unquote(U.urlsplit(url).path)):
  omit(url,'dynamic, account, admin or action endpoint not downloaded',source);return
 if any(c in url for c in ["'",'"','`']):omit(url,'nonliteral asset reference not downloaded',source);return
 discovered.setdefault(url,set()).add(source)
 if url not in asset_done:asset_pending.add(url)
def localpath(url,kind,ct=''):
 x=U.urlsplit(url);bits=[re.sub(r'[^\w.()-]+','_',U.unquote(b))[:160] for b in x.path.split('/') if b and b not in ['.','..']]
 if kind=='page':
  if not bits:bits=['index.html']
  elif '.' not in bits[-1]:bits.append('index.html')
  else:bits[-1]+='.html'
  folder='sources/pages'
 else:
  folder='sources/assets/'+x.netloc
  if not bits:bits=['index']
  if not pathlib.PurePath(bits[-1]).suffix:
   bits[-1]+= '.css' if 'css' in ct else '.js' if 'javascript' in ct else '.bin'
 if x.query:
  p=pathlib.PurePath(bits[-1]);bits[-1]=p.stem+'__q_'+hashlib.sha256(x.query.encode()).hexdigest()[:10]+p.suffix
 return folder+'/'+('/'.join(bits))
def fetch(url):
 try:
  r=requests.get(url,headers=HEADERS,timeout=(15,60),allow_redirects=False)
  chain=[]
  for i in range(5):
   if r.is_redirect:
    nxt=normalize(r.headers.get('location'),r.url,True)
    chain.append({'from':r.url,'status':r.status_code,'to':nxt})
    if not nxt or DENY.search(U.unquote(U.urlsplit(nxt).path)):
     return {'url':url,'status':r.status_code,'finalURL':nxt,'redirects':chain,'error':'redirect to excluded endpoint','time':now()}
    r=requests.get(nxt,headers=HEADERS,timeout=(15,60),allow_redirects=False)
   else:break
  return {'url':url,'status':r.status_code,'finalURL':r.url,'redirects':chain,'type':r.headers.get('Content-Type',''),'content':r.content,'encoding':r.encoding,'time':now()}
 except Exception as e:return {'url':url,'error':str(e),'time':now()}
def sanitize(text,url):
 counts=collections.Counter()
 def inp(m):
  tag=m.group();name=re.search(r'\b(?:name|id)\s*=\s*[\'"]([^\'"]+)',tag,re.I)
  if name and re.search(r'csrf|authenticity|session.?id|access.?token|password|secret|nonce',name.group(1),re.I):
   new,n=re.subn(r'(\bvalue\s*=\s*)([\'"])[\s\S]*?\2',lambda v:v.group(1)+v.group(2)+'[REDACTED]'+v.group(2),tag,flags=re.I)
   counts['sensitive form values']+=n;return new
  return tag
 text=re.sub(r'<input\b[^>]*>',inp,text,flags=re.I)
 for pattern in [r'((?:csrfToken|csrf_token|session_id|sessionId|authenticity_token|access_token|refresh_token)\s*[:=]\s*)([\'"])(.*?)\2',r'((?:PHPSESSID|JSESSIONID)\s*=\s*)([\w.-]+)']:
  def repl(m):
   counts['session or CSRF assignment values']+=1
   return m.group(1)+(m.group(2)+'[REDACTED]'+m.group(2) if m.lastindex==3 else '[REDACTED]')
  text=re.sub(pattern,repl,text,flags=re.I)

 # Service-prefixed credentials may be inadvertently exposed by anonymous CMS output.
 # Public recaptcha site keys and analytics identifiers are deliberately not matched.
 service_pattern = r'''((?:["']?)(?:[A-Za-z_$][\w$.-]*(?:api[_-]?key|api[_-]?secret|access[_-]?token|refresh[_-]?token|auth[_-]?token|client[_-]?secret|smtp[_-]?(?:password|key)|private[_-]?key)|[A-Za-z_$][\w$.-]*[_-](?:secret|password|token))(?:["']?)\s*[:=]\s*)(["'])([^"']+)\2'''
 def service_repl(m):
  if m.group(3).startswith('[REDACTED'):return m.group(0)
  counts['exposed service credential values']+=1
  return m.group(1)+m.group(2)+'[REDACTED: exposed service credential]'+m.group(2)
 text=re.sub(service_pattern,service_repl,text,flags=re.I)
 if counts:sanitizations.append({'url':url,'changes':dict(counts)})
 return text

def css_assets(text,url):
 for v in re.findall(r'url\(\s*[\'"]?([^\)\'\"]+)',text,re.I):queue_asset(v,url)
 for v in re.findall(r'@import\s+[\'"]([^\'"]+)',text,re.I):queue_asset(v,url)

def deep_data(obj,source):
 if isinstance(obj,dict):
  for k,v in obj.items():
   if isinstance(v,str) and k.lower() in ['href','url','link','registrationurl']:queue_page(v,source)
   elif isinstance(v,str) and k.lower() in ['src','image','imageurl','poster']:queue_asset(v,source)
   else:deep_data(v,source)
 elif isinstance(obj,list):
  for v in obj:deep_data(v,source)

def process_page(url,text,path):
 soup=bs4.BeautifulSoup(text,'html.parser')
 pageid=U.urlsplit(url).path.strip('/').replace('/','__') or 'home'
 pageid=re.sub(r'[^\w.-]+','_',pageid)
 page_links=[]
 for a in soup.select('a[href],area[href]'):
  raw=a.get('href');absolute=U.urljoin(url,html.unescape(raw)); rec={'source':url,'href':raw,'absoluteURL':absolute,'text':a.get_text(' ',strip=True),'download':a.has_attr('download')}
  links.append(rec);page_links.append(rec);queue_page(raw,url)
 for t in soup.select('[src],[poster],[data-src],[data-background],[data-bg],[data-image]'):
  for att in ['src','poster','data-src','data-background','data-bg','data-image']:
   if t.get(att):queue_asset(t.get(att),url)
 for t in soup.select('[srcset],[data-srcset]'):
  for att in ['srcset','data-srcset']:
   for part in (t.get(att) or '').split(','):queue_asset(part.strip().split(' ')[0],url)
 for t in soup.select('link[href]'):
  rel=' '.join(t.get('rel',[])).lower()
  if any(r in rel for r in ['stylesheet','icon','preload','modulepreload','manifest']):queue_asset(t.get('href'),url)
 for t in soup.select('style'):css_assets(t.get_text(),url)
 for t in soup.select('[style]'):css_assets(t.get('style'),url)
 for t in soup.select('meta[property="og:image"],meta[name="twitter:image"]'):queue_asset(t.get('content'),url)
 embedded=[]
 for i,t in enumerate(soup.select('script')):
  body=t.string or t.get_text()
  sid=t.get('id') or f'script-{i}'
  if t.get('type') in ['application/json','application/ld+json']:
   try:
    obj=json.loads(body);safeid=re.sub(r"[^\w.-]+","_",sid);out=f'data/embedded/{pageid}__{safeid}.json';jswrite(out,obj);embedded.append({'id':sid,'type':t.get('type'),'path':out});deep_data(obj,url)
   except Exception:pass
  for m in re.finditer(r'\b(?:var|let|const)\s+([A-Za-z_$][\w$]*(?:Data|DATA|data|Config|CONFIG|config))\s*=\s*([\[{])',body):
   try:
    obj,end=json.JSONDecoder().raw_decode(body[m.start(2):]);name=m.group(1)
    if not isinstance(obj,(dict,list)) or not obj:continue
    out=f'data/embedded/{pageid}__{name}.json';jswrite(out,obj);embedded.append({'id':name,'type':'inline JavaScript JSON literal','path':out});deep_data(obj,url)
   except Exception:pass
  for v in re.findall(r'[\'"]((?:https?://[^\s\'\"]+|/(?:sites/files|registration/product-detail|programs|camps|try-leap|birthday-parties|about|faq|leap-updates|summer-camp-themes)[^\s\'\"]*))[\'"]',body):
   if EXT.search(v):queue_asset(v,url)
   elif '/registration/product-detail/' in v or same(normalize(v,url) or ''):queue_page(v,url)
 def metaval(**attrs):
  q=soup.find('meta',attrs=attrs);return q.get('content') if q else None
 main=soup.select_one('.mainContent') or soup.find('main') or soup.body or soup
 # Parse a clone for extraction so original HTML/Beam never changes.
 main=bs4.BeautifulSoup(str(main),'html.parser')
 for x in main.select('script,style,template,noscript,svg,nav,header,footer,#beam-data,#beam-pet'):x.decompose()
 lines=[re.sub(r'\s+',' ',x).strip() for x in main.get_text('\n',strip=True).splitlines()]
 readable='\n'.join(x for x in lines if x)
 headings=[{'level':int(t.name[1]),'text':t.get_text(' ',strip=True),'id':t.get('id')} for t in soup.find_all(re.compile('^h[1-6]$'))]
 forms=[]
 for f in soup.select('form'):forms.append({'action':f.get('action'),'method':f.get('method','get'),'fields':[{'name':t.get('name'),'type':t.get('type') or t.name,'label':t.get('aria-label')} for t in f.select('input,select,textarea')]})
 title=soup.title.get_text(' ',strip=True) if soup.title else (soup.find(['h1','h2']).get_text(' ',strip=True) if soup.find(['h1','h2']) else '')
 page={'url':url,'sourcePath':path,'title':title,'description':metaval(name='description'),'canonical':[t.get('href') for t in soup.select('link[rel="canonical"]')],'robots':metaval(name='robots'),'headings':headings,'anchorIDs':sorted(set(t.get('id') for t in soup.select('[id]'))),'links':page_links,'forms':forms,'embeddedData':embedded,'images':[{'src':t.get('src'),'alt':t.get('alt'),'width':t.get('width'),'height':t.get('height')} for t in soup.select('img')],'beamBlocks':[{'id':t.get('id'),'sha256':hashlib.sha256(str(t).encode()).hexdigest()} for t in soup.select('#beam-data,#beam-pet')],'readableTextPath':f'content/{pageid}.md'}
 jswrite(f'metadata/{pageid}.json',page)
 p=ROOT/f'content/{pageid}.md';p.parent.mkdir(parents=True,exist_ok=True);p.write_text(f'# {title}\n\nSource: {url}\n\n{readable}\n',encoding='utf-8')
 metadata.append({'url':url,'title':title,'metadataPath':f'metadata/{pageid}.json','contentPath':f'content/{pageid}.md','embeddedDataCount':len(embedded),'sourcePath':path})
 # Public custom cards as useful structured content, without changing values.
 cards=[]
 for t in soup.select('.program-card,.leap-reg-card,.leap-reg-option'):
  cards.append({'tag':t.name,'class':t.get('class'),'id':t.get('id'),'text':t.get_text(' ',strip=True),'links':[{'text':a.get_text(' ',strip=True),'href':a.get('href')} for a in t.select('a[href]')],'dataAttributes':{k:v for k,v in t.attrs.items() if k.startswith('data-')}})
 if cards:jswrite(f'data/programs/{pageid}.json',cards)


def accept(result,kind):
 url=result['url'];ct=result.get('type','');content=result.pop('content',None)
 record={k:v for k,v in result.items() if k!='encoding'};record['kind']=kind
 redirects.extend(result.get('redirects',[]))
 if content is not None and result.get('status')==200:
  ishtml='text/html' in ct or content.lstrip()[:20].lower().startswith((b'<!doctype html',b'<html'))
  if kind=='asset' and ishtml:
   record['error']='asset URL returned HTML; response not archived';record['receivedBytes']=len(content);manifest[url]=record;return
  if kind=='page' and not ishtml:
   kind='asset';record['kind']='asset'
  if len(content)>80_000_000:
   record['error']='public asset exceeds 80 MB Git-friendly size limit';record['receivedBytes']=len(content);manifest[url]=record;return
  path=localpath(url,kind,ct)
  text=None
  if ishtml or any(t in ct for t in ['javascript','text/css','application/json','text/plain','xml']):
   enc=result.get('encoding') or 'utf-8'
   if enc.lower()=='iso-8859-1':enc='utf-8'
   text=content.decode(enc,errors='replace');text=sanitize(text,url);saved=text.encode('utf-8')
  else:saved=content
  p=ROOT/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(saved)
  record.update({'path':path,'sha256':hashlib.sha256(saved).hexdigest(),'bytes':len(saved),'receivedBytes':len(content),'capturedAtUTC':result['time']})
  if ishtml and kind=='page':process_page(url,text,path)
  elif text is not None:
   if 'css' in ct or U.urlsplit(url).path.endswith('.css'):css_assets(text,url)
   # Site-specific literal asset URLs in JS; avoid library examples and runtime action endpoints.
   if 'javascript' in ct:
    for v in re.findall(r'[\'"]((?:/sites/(?:files|images)/|https://www\.leapgymnastics\.ca/sites/)[^\s\'\"]+)[\'"]',text):queue_asset(v,url)
  if url.endswith('sitemap.xml') and text:
   for loc in re.findall(r'<loc>(.*?)</loc>',text):queue_page(loc,url)
 else:record['error']=record.get('error') or f'HTTP {result.get("status")}'
 manifest[url]=record

def checkpoint():
 jswrite('manifest.json',{'source':BASE,'captureStartedUTC':START,'lastUpdatedUTC':now(),'entries':sorted(manifest.values(),key=lambda x:x['url'])})
 jswrite('coverage.json',{'captureStartedUTC':START,'lastUpdatedUTC':now(),'pagesProcessed':len(page_done),'assetsProcessed':len(asset_done),'pagesPending':sorted(page_pending),'assetsPending':sorted(asset_pending),'successfulPages':len(metadata),'totalSavedBytes':sum(x.get('bytes',0) for x in manifest.values()),'limits':{'maxPages':260,'maxAssets':1000,'concurrency':6,'maxAssetBytes':80000000},'discoveryMethods':['robots.txt','sitemap.xml','same-origin HTML anchor links','JSON and inline JavaScript literal public links','HTML asset attributes','CSS url() and imports'],'canonicalization':'Fragments removed for fetching and retained in link inventory; cache-buster and registration sort/calendar query variants deduplicated.'})
 print(json.dumps({'pages':len(page_done),'assets':len(asset_done),'pendingPages':len(page_pending),'pendingAssets':len(asset_pending),'bytes':sum(x.get('bytes',0) for x in manifest.values())}),flush=True)

# Fresh unauthenticated discovery, no Session object and no cookie jar.
for initial in [BASE+'/robots.txt',BASE+'/sitemap.xml']:
 accept(fetch(initial),'asset');asset_done.add(initial)
queue_page(BASE+'/',BASE+'/sitemap.xml')
while page_pending and len(page_done)<260:
 batch=sorted(page_pending)[:6]
 for u in batch:page_pending.discard(u);page_done.add(u)
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
  for r in pool.map(fetch,batch):accept(r,'page')
 checkpoint()
if args.browser_resources:
 for observed in json.loads(pathlib.Path(args.browser_resources).read_text(encoding='utf-8-sig')):
  if NO_EXTERNAL.search(observed) or 'doubleclick' in observed or 'REDACTED' in U.unquote(observed):continue
  if not EXT.search(observed) and not any(h in observed for h in ['fonts.googleapis.com/','/globals.php']):continue
  queue_asset(observed,'anonymous browser resource observation')
while asset_pending and len(asset_done)<1000:
 batch=sorted(asset_pending)[:6]
 for u in batch:asset_pending.discard(u);asset_done.add(u)
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
  for r in pool.map(fetch,batch):accept(r,'asset')
 if len(asset_done)%30<6:checkpoint()
# Assets may reveal extra actual content links only through sitemap; process any remaining safe page queue.
for u in page_pending:omit(u,'crawl page limit reached',next(iter(discovered.get(u,{BASE}))))
for u in asset_pending:omit(u,'crawl asset limit reached',next(iter(discovered.get(u,{BASE}))))
checkpoint()
jswrite('page-index.json',sorted(metadata,key=lambda x:x['url']))
jswrite('link-inventory.json',links)
jswrite('omissions.json',sorted(omissions.values(),key=lambda x:(x['reason'],x['url'])))
jswrite('errors.json',[x for x in manifest.values() if x.get('error')])
jswrite('sanitization-report.json',{'policy':'Anonymous HTTP only; no cookie persistence, request credentials, response Set-Cookie headers, user/account exports, form submissions or transactions. Only HTML input values and inline assignments specifically named as CSRF/session/authentication secrets are redacted. Public captcha site keys and tracking IDs are identifiers, not authentication secrets. Public business contact details and published staff bios are retained as public site content.','changes':sanitizations,'capturedResponseHeaders':['Content-Type'],'totalChangedResponses':len(sanitizations)})
jswrite('redirects.json',redirects)
jswrite('discovery.json',{u:sorted(s) for u,s in sorted(discovered.items())})
finished=now();errors=[x for x in manifest.values() if x.get('error')]
readme=f'''# Leap Gymnastics â€” current public website snapshot\n\nSource: {BASE}/\n\nCapture started (UTC): {START}\nCapture finished (UTC): {finished}\n\nThis is an anonymous, read-only archive of the currently published website, including its existing custom CMS output. It is **not** a backend database, CMS revision-history, payment, account, or administration export. No live content was changed. No redesign preview is included.\n\n## Contents\n\n- `sources/pages/`: published HTML, retaining inline custom CSS/JavaScript, calendar controllers and original Beam blocks.\n- `sources/assets/`: downloaded public CSS, JavaScript, images, fonts and linked documents, including recursively referenced CSS dependencies.\n- `content/`: readable page content.\n- `metadata/`: titles, descriptions, headings, anchors, links, image metadata and public form structures.\n- `data/embedded/`: embedded JSON and safely parseable JSON literals extracted from inline JavaScript.\n- `data/programs/`: published program cards and registration options, with original details and links.\n- `manifest.json`: source URLs, HTTP status, local paths, timestamps, byte counts and SHA-256 hashes.\n- `link-inventory.json`: original hyperlinks and fragment destinations.\n- `coverage.json`, `discovery.json`, `redirects.json`, `errors.json`, `omissions.json`: crawl scope and limitations.\n- `sanitization-report.json`: privacy handling and any redactions.\n\n## Coverage and limitations\n\nCaptured {len(metadata)} public HTML responses and {sum(1 for x in manifest.values() if x.get('kind')=='asset' and x.get('path'))} public assets. Total saved source bytes: {sum(x.get('bytes',0) for x in manifest.values()):,}. Failed or unavailable fetches: {len(errors)}; details in `errors.json`.\n\nDiscovery followed the site's current sitemap and actual public links, including public registration product-detail pages and links inside embedded data. The sitemap alone is incomplete, so navigation and content links were also traversed. Unlinked or unpublished CMS pages cannot be discovered from a public crawl. Query-only sort/calendar duplicates were canonicalized; their original URLs remain in the link inventory.\n\nAccount, admin, revision, checkout/cart, action and dynamic API endpoints were not fetched. Third-party analytics, captcha and embedded service code were inventoried but not downloaded. External destinations are inventoried rather than crawled as Leap content. See `omissions.json` for every observed excluded URL.\n\nThe HTML retains original live URLs and runtime code for fidelity. This archive is a reference and recovery input, **not a working offline checkout or a drop-in CMS/database restore**. Forms, availability, registration actions, third-party integrations and server-generated behaviour require the live service. Availability can change after the timestamp. For safe review, start with Markdown/JSON content and the screenshots; do not submit archived forms.\n\n## Verify file integrity\n\nEach archived response has a SHA-256 value in `manifest.json`. Extracted metadata/text is derived from the saved HTML. Cookie headers and logged-in data were not captured. Exposed service credentials were redacted before publication; no authentication credentials are retained.\n'''
(ROOT/'README.md').write_text(readme,encoding='utf-8')
print('COMPLETE',len(metadata),len(manifest),len(errors),finished,flush=True)
