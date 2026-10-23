# Bug report to send to Uplifter

**Send to:** Uplifter support
**Subject:** Custom-domain clubs cannot publish a canonical tag — our pages are being
indexed under leapgymnastics.uplifterinc.com instead of our own domain

> Copy everything below the line into the ticket.

---

Hello,

This is a **platform limitation report with evidence from Google Search Console**, not a
configuration question. Please route it to engineering. I have read the Public Website
Management and Settings KB articles; what follows is not something a club can configure
around.

**Club:** Leap Gymnastics — custom domain `www.leapgymnastics.ca`

## The problem, with Google's own diagnosis

Our content is served on both `www.leapgymnastics.ca` and
`leapgymnastics.uplifterinc.com`, byte-identical, both HTTP 200. Google Search Console
reports the following for our contact page:

```
URL inspected:              https://www.leapgymnastics.ca/contact/
Page indexing:              Page is not indexed: Duplicate without user-selected canonical
User-declared canonical:    None
Google-selected canonical:  https://leapgymnastics.uplifterinc.com/contact/
Crawl allowed:              Yes
Indexing allowed:           Yes
```

**Google has chosen the `uplifterinc.com` copy as the canonical version of our page, and
our own domain is therefore not indexed at all.** The cause is stated explicitly:
*"User-declared canonical: None"* — there is no canonical signal in the page, so Google
picked one for us, and it picked yours.

## Why we cannot fix this ourselves

Uplifter's Page Details → Meta Tags accepts only a tag **name** and **content**, and renders
them as `<meta name="..." property="..." content="..." />`. We verified this against our own
live output (our Google verification tag renders exactly that way).

Google honours a canonical **only** as `<link rel="canonical">` or an HTTP `Link:` header.
A `<meta name="canonical">` is ignored entirely. There is no `<link>` path in Page Details,
no HTTP header control, and no base-URL/canonical-domain field anywhere in Settings
(article 202321284 exposes only Site Title, Site Description, Keywords and the GA ID).

So a club on a custom domain has **no supported way** to tell Google which hostname is
authoritative. We are currently relying on a JavaScript workaround injected into our footer,
which is materially weaker than a server-rendered tag.

## What we are asking for (any one of these solves it)

1. **Emit `<link rel="canonical">` automatically** on every public page, pointing at the
   club's active custom domain. This is the cleanest fix and would benefit every club.
2. **301-redirect `*.uplifterinc.com` to the custom domain** once one is active.
3. **Serve `X-Robots-Tag: noindex` on the `*.uplifterinc.com` hostname only** when a custom
   domain is configured.

Any of these would permanently resolve duplicate-hostname indexing for all custom-domain
clubs. Option 1 or 2 is preferable, as 3 alone loses link equity.

## Secondary: a sitemap generator bug

Separately, `/sitemap.xml` emits malformed URLs for admin-created pages — the base URL and
the slug are concatenated **without a slash**:

| URL emitted | Valid? |
|---|---|
| `https://www.leapgymnastics.ca/` | yes |
| `https://www.leapgymnastics.ca/registration/` | yes |
| `https://www.leapgymnastics.ca/contact-us/` | yes |
| `https://www.leapgymnastics.ca/login/` | yes |
| `https://www.leapgymnastics.caabout/` | **no — missing slash** |
| `https://www.leapgymnastics.cabirthday-parties/` | **no** |
| `https://www.leapgymnastics.cacamps/` | **no** |
| `https://www.leapgymnastics.cacontact/` | **no** |
| `https://www.leapgymnastics.cafaq/` | **no** |
| `https://www.leapgymnastics.caprograms/` | **no** |

The signature localises it cleanly: the **4 system-generated pages** are correct and carry
`<priority>`; the **6 admin-created pages** are all broken and carry `<lastmod>`. Two code
paths, one defective. This will affect every club on the platform.

We have worked around it by uploading our own corrected sitemap and submitting that instead,
so this is not urgent for us — but the default file is still wrong and Google may still
discover it at the standard location.

Also, the file is not stable: on repeated fetches it has served the same paths under the
`leapgymnastics.uplifterinc.com` hostname at one point, and under `www.leapgymnastics.ca` at
another. Please make the hostname deterministic.

Thank you,
Leap Gymnastics

---

## Notes for Leap (do not send)

- **The canonical limitation is the real issue** and is now evidenced by Google's own words.
  That's why it leads the ticket. The sitemap bug is genuine but we've already worked around it.
- If they refuse: the JavaScript workaround in the footer is the only remaining lever, and
  it is now correctly configured (see file 3).
