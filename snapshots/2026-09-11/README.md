# Leap Gymnastics - current public website snapshot

Source: https://www.leapgymnastics.ca/

Capture started (UTC): 2026-09-11T17:17:06.908853+00:00
Capture finished (UTC): 2026-09-11T17:26:56.817044+00:00

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

Captured 99 public HTML responses (13 content/policy routes, 85 named public product-detail routes and 1 empty product-detail prefix response), plus 166 public assets. Total saved source bytes: 36,593,986. Failed or unavailable fetches: 1; details in `errors.json`.

Discovery followed the site's current sitemap and actual public links, including public registration product-detail pages and links inside embedded data. The sitemap alone is incomplete, so navigation and content links were also traversed. Unlinked or unpublished CMS pages cannot be discovered from a public crawl. Query-only sort/calendar duplicates were canonicalized; their original URLs remain in the link inventory.

Account, admin, revision, checkout/cart, action and dynamic API endpoints were not fetched. The exact public GET `/ajax/cookies.php`, linked as “View our policies,” was included as a reviewed read-only policy exception. No other Ajax endpoint was included. Third-party analytics, captcha and embedded service code were inventoried but not downloaded. External destinations are inventoried rather than crawled as Leap content. See `omissions.json` for every observed excluded URL.

The HTML retains original live URLs and runtime code for fidelity. This archive is a reference and recovery input, **not a working offline checkout or a drop-in CMS/database restore**. Forms, availability, registration actions, third-party integrations and server-generated behaviour require the live service. Availability can change after the timestamp. For safe review, start with Markdown/JSON content and the screenshots; do not submit archived forms.

Browser-observed static dependencies from the fresh visual capture were reconciled as well; see `browser-resource-reconciliation.json`.

A populated email-service API credential was present in the anonymous registration HTML. It was removed from the raw response and every derived occurrence before publication. `sanitization-report.json` records the field name and affected files without its value.

## Verify file integrity

Each archived response has a SHA-256 value in `manifest.json`. Extracted metadata/text is derived from the saved HTML. Cookie headers and logged-in data were not captured. Exposed service credentials were redacted before publication; no authentication credentials are retained.

## Capture again

The portable, read-only crawler is included under `tools/`. It requires Python 3.11+ and the two packages in `tools/requirements.txt`. In a separate environment, run:

```sh
python -m pip install -r tools/requirements.txt
python tools/capture.py --output new-public-snapshot
```

An optional `--browser-resources resources.json` accepts an array of observed public static URLs to reconcile assets loaded by JavaScript. Measurement/captcha endpoints and redacted URLs are ignored. Re-running fetches current public state; it cannot reproduce past availability. Screenshot capture is separate from this crawler.

## Browser evidence and complete archive checksums

`screenshots/` contains 16 fresh anonymous public-site screenshots. `browser-evidence.json` records desktop coverage, mobile Programs/Registration states, visible content and links, and screenshot SHA-256 hashes. Measurement beacons and capture-session identifiers were excluded.

`SHA256SUMS.txt` covers all archive files, including derived content, documentation and screenshots, except itself. The source-response manifest remains a separate URL-to-file record.

An apparent email-service credential exposed in the public registration response was replaced with a redaction marker in the source HTML and derived data before publication. The sanitization report records the field and affected files without retaining the credential. This archive contains no authentication credentials or private account export.
