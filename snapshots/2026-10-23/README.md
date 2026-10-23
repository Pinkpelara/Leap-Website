# Leap Gymnastics â€” current public website snapshot

Source: https://www.leapgymnastics.ca/

Capture started (UTC): 2026-10-23T16:33:56.328670+00:00
Capture finished (UTC): 2026-10-23T16:34:46.445013+00:00

This is an anonymous, read-only archive of the currently published website, including its existing custom CMS output. It is **not** a backend database, CMS revision-history, payment, account, or administration export. No live content was changed. No redesign preview is included.

## Contents

- `sources/pages/`: published HTML, retaining inline custom CSS/JavaScript, calendar controllers and original Beam blocks.
- `sources/assets/`: downloaded public CSS, JavaScript, images, fonts and linked documents, including recursively referenced CSS dependencies.
- `content/`: readable page content.
- `metadata/`: titles, descriptions, headings, anchors, links, image metadata and public form structures.
- `data/embedded/`: embedded JSON and safely parseable JSON literals extracted from inline JavaScript.
- `data/programs/`: published program cards and registration options, with original details and links.
- `manifest.json`: source URLs, HTTP status, local paths, timestamps, byte counts and SHA-256 hashes.
- `link-inventory.json`: original hyperlinks and fragment destinations.
- `coverage.json`, `discovery.json`, `redirects.json`, `errors.json`, `omissions.json`: crawl scope and limitations.
- `sanitization-report.json`: privacy handling and any redactions.

## Coverage and limitations

Captured 110 public HTML responses and 164 public assets. Total saved source bytes: 40,543,011. Failed or unavailable fetches: 1; details in `errors.json`.

Discovery followed the site's current sitemap and actual public links, including public registration product-detail pages and links inside embedded data. The sitemap alone is incomplete, so navigation and content links were also traversed. Unlinked or unpublished CMS pages cannot be discovered from a public crawl. Query-only sort/calendar duplicates were canonicalized; their original URLs remain in the link inventory.

Account, admin, revision, checkout/cart, action and dynamic API endpoints were not fetched. Third-party analytics, captcha and embedded service code were inventoried but not downloaded. External destinations are inventoried rather than crawled as Leap content. See `omissions.json` for every observed excluded URL.

The HTML retains original live URLs and runtime code for fidelity. This archive is a reference and recovery input, **not a working offline checkout or a drop-in CMS/database restore**. Forms, availability, registration actions, third-party integrations and server-generated behaviour require the live service. Availability can change after the timestamp. For safe review, start with Markdown/JSON content and the screenshots; do not submit archived forms.

## Verify file integrity

Each archived response has a SHA-256 value in `manifest.json`. Extracted metadata/text is derived from the saved HTML. Cookie headers and logged-in data were not captured. Exposed service credentials were redacted before publication; no authentication credentials are retained.
