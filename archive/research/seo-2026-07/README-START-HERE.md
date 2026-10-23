# Leap Gymnastics — SEO diagnosis & actions (July 2026)

## The root cause, in Google's own words

Google Search Console, inspecting `https://www.leapgymnastics.ca/contact/`:

```
Page is not indexed: Duplicate without user-selected canonical
User-declared canonical:    None
Google-selected canonical:  https://leapgymnastics.uplifterinc.com/contact/
Last crawl:                 Jul 18, 2026
```

That is the entire explanation for the scattered search results:

1. Your pages carry **no canonical signal**, so Google had to choose a winner itself.
2. It chose the **uplifterinc.com** copy. Your real page is **not indexed at all**.
3. It last looked on **July 18** — *before* the canonical JavaScript was added on July 21.
   Google has not yet seen the fix.

This is not a content, keyword or copywriting problem. It's one missing signal.

---

## What was fixed today

**Removed a dangerous `noindex`.** The footer script was telling Google two contradictory
things about the Uplifter copy: *"this is a duplicate of the real page"* **and** *"don't
index this page."* Since Google had selected that very page as canonical, honouring the
`noindex` could have dropped your pages from Google entirely.

- Removed: 210 characters (the three `robots`/`noindex` lines only)
- Kept: the canonical assignment and the redirect — the only levers that reach the Uplifter copy
- Verified live on all pages; Beam untouched (she lives in a different field)

---

## Corrections — things I got wrong, on the record

I stated several things confidently that turned out to be false. Correcting them properly:

**1. I said Codex's sitemap claim was false. It was true.**
Codex reported *"11 unique www URLs, all returning HTTP 200."* I tested Uplifter's
auto-generated `/sitemap.xml` and found 6 dead URLs — but that is **not the sitemap
submitted to Google**. Codex uploaded a correct one to `/sites/files/leap-sitemap.xml`:
11 URLs, all live, all your domain, including `/try-leap/` and `/leap-updates/` which
Uplifter's version omits. **Codex solved the sitemap problem.** I was testing the wrong file.

**2. My research concluded you couldn't host your own sitemap. Wrong.**
Uplifter has a file area at `/sites/files/`. Codex found it and used it.

**3. I was too harsh on Codex's JavaScript.**
Given Uplifter makes a real canonical tag *impossible*, JavaScript is the only mechanism
that can reach the duplicate copy. It was the right call. Only the `noindex` was wrong.

**4. I twice reported "the JavaScript isn't working."**
Both times I was testing while logged in as admin, where the CMS puts page content into
form fields so scripts don't run. Logged out — which is what Google sees — it is a genuine,
executable `<script>` tag. It works.

**5. I said the Uplifter address was feeding Google its own URLs.**
True when first tested, not now. The file is unstable, which is itself worth reporting.

The lesson worth keeping: **check whether you're logged in as admin before concluding
anything is broken on this site.** It changes what the page contains.

---

## The files

| File | What it is | Status |
|---|---|---|
| **1-UPLIFTER-BUG-REPORT.md** | Ticket for Uplifter, now led by Google's own diagnosis. Asks them to emit a canonical, 301 the subdomain, or noindex it. | Ready to send |
| **2-GOOGLE-PROFILE-AND-REVIEWS.md** | Google Business Profile, reviews, directories, the Stouffville gap. Plus the verdict on Soro and Jumper Media. | Ready |
| **3-SMALL-TWEAKS-AND-CMS-FIXES.md** | Small surgical page tweaks. No rewrite. | Section C1 now done |

---

## What happens next, and what to watch

The fix is in place but **Google must re-crawl to see it.** Last crawl was July 18; the
canonical arrived July 21; the `noindex` was removed today. Nothing changes in search results
until Google returns — typically days to a few weeks.

**How to check progress:** in Search Console → URL Inspection, inspect
`https://www.leapgymnastics.ca/contact/`. You're waiting for:

- *User-declared canonical* to change from **None** to your `www` URL
- *Google-selected canonical* to flip from the uplifterinc URL to your `www` URL

**Honest uncertainty:** a JavaScript canonical is weaker and slower than a server-rendered
one, and Google is not guaranteed to honour it. If it hasn't flipped in 3–4 weeks, the
answer is Uplifter fixing it at the platform level — which is exactly what file 1 asks for.
That ticket matters more than it looks.

---

## Still worth more than all of the above

Your parents arrive through the map pack, not blue links. Profile signals are roughly a third
of local ranking and reviews about a fifth. You're at 5.0 stars with ~8 reviews and no opening
hours set. **File 2 is where the actual growth is.**
