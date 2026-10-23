# Leap migration coverage, October 23, 2026

Leap-Website is the primary project repository. This migration closes the earlier gap between the cloud archive and Windows birthday source. Existing history and the September 11 snapshot are preserved, including both previously consolidated Leap-Gym branches.

## Transferred and reviewed

- Latest birthday source, including October 22 native-invoice portal, draft/submit forms, consent history, recovery and legacy routing.
- Portable dependency manifest/lock, build and offline tests. Old-machine build paths removed.
- All 21 curated Tencent records, with birthday decisions corrected and older observations labelled. Fresh local ingest/search verified. JSON and the pinned runtime recreate SQLite; raw SQLite is ignored.
- Working rules, current state, KB links, setup, environment names without values, and source mapping.
- Historical custom CMS files alongside previously imported Leap-Gym material.
- Fresh anonymous public capture: 110 HTML responses and 164 saved assets, 40,543,011 source bytes. One asset URL returned HTTP 404 and was not archived; see errors and omissions. This is not an authenticated CMS/database export.

## Exclusions and remaining transfer

No private customer records, signed waivers, private form links, email exports, credentials, browser profiles, administrative HTML, corporate documents or raw chats were added. Originals remain in place; no original source files were moved or deleted.

The owner requested continued use of the public repository, with a possible visibility change later. A second pass added 39 reviewed original files: vector logos, brochure/print files, invitation-maker source and July SEO notes. See ../archive/README.md and its checksum manifest. Private customer material, signed forms, correspondence, corporate paperwork, credentials and unreviewed photos/videos remain excluded. This is still not a complete private backup. Little-Beam remains separate and was not modified.

One legacy override contained a private reservation identifier. Public source/tests use a synthetic identifier. Restore authorized private configuration before deployment. Setup does not deploy anything.

Current docs supersede September brief deployment instructions and the obsolete October 16 draft label. See CURRENT_STATE.md for website wording, summer-theme content and scheduler follow-ups. Live fixes were not part of this migration.

## Validation

Portable build passed: 16 delivery, 30 form/intake and 10 portal tests, plus invoice, mail-recovery, calendar-alias and package-override suites. Tests use synthetic/in-memory data. Tencent ingest/search succeeded in local VectorStore/FTS mode. No production messages, bookings, payments or deployments were performed.

See migration/source-map.json for original relative source locations and migration/environment-names.json for variable/binding names. Source paths are provenance, not old-machine dependencies.
