# Small tweaks only — your copy and design stay

**Scope rule for this file:** no rewrite, no revamp. Your page text is good and the CMS work
behind it is respected. What follows is a short list of *surgical* changes, each with a
specific reason. Everything not listed here stays exactly as it is.

Your **title tags and meta descriptions are genuinely well done** — unique per page, and each
one carries the category plus "Markham & Stouffville". That's the best-executed layer on the
site. **Do not change them.**

---

## A. Four tiny text changes

### A1. "P.A. day" → "PA Day"  *(one word, high value)*

Your homepage writes **"P.A. day camps"**; your camps page writes **"PA Day"**. Parents search
the unpunctuated form, and the inconsistency splits the signal.

- **Where:** homepage body text
- **Change:** `P.A. day camps` → `PA Day camps`
- **Why:** matches how parents actually type it; makes the two pages agree

### A2. Lead with "trial class" on /try-leap/  *(heading only)*

Your page currently leads with **"Drop-In"**. In Ontario gymnastics, "drop-in" usually means
*non-instructional open gym* — but yours is a **coached trial**, which is a different and more
appealing thing. Parents new to a gym search **"trial class"**.

- **Where:** the H1 on /try-leap/
- **Now:** `New to Leap Gymnastics? Start with a Drop-In Session`
- **Suggested:** `Try a Gymnastics Class in Markham — Coached Trial Session`
- **Keep the URL `/try-leap/` unchanged** — changing it would throw away existing indexing
- **Body text stays as-is**

*Optional and separate:* you use "drop-in" for two different products ("Little Explorers
Drop-In" is genuinely open gym). Renaming that one to "Little Explorers **Open Gym**" would
stop the two colliding. Your call — it's a product name, not an SEO issue.

### A3. Make three H1s match their (good) titles

Your titles say the right thing; the on-page headings don't repeat it. Google weighs the H1.
These are one-line changes:

| Page | H1 now | Suggested H1 |
|---|---|---|
| /programs/ | School Year Programs | Gymnastics Classes in Markham & Stouffville |
| /camps/ | Camps & Summer Programs | Gymnastics Camps in Markham — PA Day, March Break & Summer |
| /birthday-parties/ | Birthday Parties | Gymnastics Birthday Parties in Markham |

If any of these read as too long or too "SEO-ish" for your design, skip them — the titles are
already doing most of the work. **A1 and A2 matter more than A3.**

### A4. Publish the actual PA Day dates on /camps/

Additive, not a rewrite. Parents search *"PA day camp Markham \<month\>"* and dated pages are
what capture those searches. Add the York Region District School Board / York Catholic PA day
dates as plain text, refreshed each school year.

---

## B. One paragraph to add — the Stouffville gap

The clearest opportunity found in the whole project: **no dedicated artistic gymnastics club
ranks in Stouffville searches.** The local operators there are fitness/tumbling hybrids.
Competition for "gymnastics Stouffville" is *low* — the cheapest ranking available to you.

You already serve these families; the site just doesn't say so in a way Google can read.

**Add this as one short section on /programs/, and a similar line on /camps/:**

> **Coming from Stouffville?**
> A number of our gymnasts travel in from Whitchurch-Stouffville each week. Our Markham gym
> runs preschool, recreational, boys and tumbling classes on weeknights and weekends, plus
> PA Day, March Break and summer camps.

Adjust the wording to match your voice — the important part is that the words "Stouffville"
and "Whitchurch-Stouffville" appear in real body text on the pages that sell classes and camps.

---

## C. Technical fixes needing CMS access

### C1. Remove the contradictory `noindex`  *(the one real error)*

The global script currently tells Google two opposite things about the Uplifter copy:
*"this is a duplicate of the real page"* (canonical) **and** *"drop this page"* (noindex).
Google advises against combining these, and it can cause the wrong page to be dropped.

The canonical and the redirect should stay — they're the only lever that reaches the Uplifter
copy at all. **Only the two `robots` lines come out.**

Replacement for the global footer script (`id="leap-global-origin-canonical-20260721"`):

```html
<script id="leap-global-origin-canonical-20260721">
(function(){
  var canonicalHost="www.leapgymnastics.ca";
  var originHost="leapgymnastics.uplifterinc.com";
  var path=location.pathname||"/";
  var privatePath=path.indexOf("/admin/")===0||path.indexOf("/pages/uSimpleCMSAdmin/")===0||path.indexOf("/ajax/")===0||path.indexOf("/api/")===0;
  if(privatePath)return;
  var canonicalUrl="https://"+canonicalHost+path;
  var canonical=document.querySelector('link[rel="canonical"]');
  if(!canonical){canonical=document.createElement("link");canonical.rel="canonical";document.head.appendChild(canonical);}
  canonical.href=canonicalUrl;
  if(location.hostname===originHost){
    location.replace(canonicalUrl+location.search+location.hash);
  }
})();
</script>
```

*Difference from what's live: the two lines that set `robots` to `noindex,follow` are deleted.
Nothing else changes.*

### C2. Do NOT enable the sitemap checkboxes yet  *(sequencing matters)*

`/try-leap/` and `/leap-updates/` are missing from the sitemap because their per-page
**"Site Map"** checkbox is off. Turning it on looks like an easy win — **but don't**, yet.

Both are admin-created pages, so Uplifter's bug would emit them as
`https://www.leapgymnastics.catry-leap/` — two *more* dead URLs.

**Correct order:** wait for Uplifter to fix the slash bug (file 1) → *then* tick both boxes.

### C3. Leave the canonical idea alone — it's impossible here

For the record, so nobody re-attempts it: Uplifter's Page Details only emits
`<meta name="..." content="...">`. Google only honours `<link rel="canonical">` and ignores a
meta version entirely. **There is no way to publish a real canonical tag through Uplifter.**
That's why the JavaScript in C1 exists and why it should be kept.

---

## What I deliberately did NOT change

- All title tags and meta descriptions — already strong
- Your program names and brand language (Leap Together, Little Leapers, Rising Stars, etc.)
- Page structure, layout, design, or CMS blocks
- Body copy on every page not named above
- Beam — untouched
