# Leap current state, October 23, 2026

## Where to start

`cloudflare-pages/birthday-qc-20261016/` is the latest maintained birthday application source found in the Windows workspace. Despite its directory date, it includes October 22 changes. It supersedes the October 13 implementation and the September briefs. The imported source is a reviewed public migration copy, not an exact production bundle; see the private configuration exception below.

The latest recorded main Worker code release is `360e4ddc` on October 22, followed by configuration enabling `NATIVE_INVOICE_CUTOVER_MS=1792701157408`. Publication is supported by the original release status and chat verification, not a fresh authenticated production audit during this migration.

## Birthday workflow

1. Parents book, choose their package and pay the deposit in native Uplifter. Custom forms do not control whether a reservation is accepted.
2. The native Uplifter invoice message contains the party-form and consent access links. The shared message is preserved in `uplifter/native-invoice-message.html`.
3. On opening a link, parents verify ownership of their booking email using a one-time code, then see only their imported bookings and private links. No separate automatic initial welcome email is sent after the cutover.
4. Save draft is silent. Save and submit validates and notifies Leap for the initial submission and later submitted changes. Consent amendments preserve signed history and notify the parent and Leap.
5. New bookings receive two scheduled reminders: a party-form reminder before the seven-day deadline and a consent reminder two days before the party.
6. Submitted party details generate the itemized balance invoice. Payment ends with invoice and e-transfer; do not promise a later payment receipt or automatic bank reconciliation.
7. Email/invoice delivery reconciliation checks provider evidence before retrying uncertain new sends. Outages retain work for later checks. Historical untracked messages must not be resent by recovery.

Intake still depends on authenticated Uplifter notification emails reaching the mailbox and being imported. This is not a direct continuous reconciliation of all Uplifter registrations. A missing imported record is an access/automation exception, not an Uplifter booking rejection.

## Verified and unresolved

- The original October 22 release note reported 56 automated checks plus invoice checks passing. Migration reran those 56 checks and the invoice, mail-recovery, calendar-alias and scoped package-override suites successfully.
- The latest chat reports verification-email arrival and correct account lookup, superseding the earlier release note's “arrival unconfirmed.” No real paid checkout was performed in the migration.
- Website wording still had a follow-up: obsolete separate-party-email wording. Payment receipt wording was handled by the rendered display script while the saved CMS sentence remained. Do not assume a source text search proves what parents see.
- The October 21 audit found missing summer-camp theme content/anchors. Historical CMS material is available, but has not been reapplied.
- The main scheduled Worker was reported healthy; an older separate scheduler dashboard showed errors. Inspect before changing schedules to avoid duplicate processing.
- The legacy package override contained a private reservation ID. The public copy uses a synthetic ID, including its regression fixture. Restore the authorized private value from the original workspace/current deployment before deploying that router. The live service was not changed.

## Other workstreams

- Current public website capture: `../snapshots/2026-10-23/`. September capture remains historical.
- Website/custom CMS reference material: `../site-content/`; older files are not current live authority.
- Program decisions, capacity rules, billing history, design requirements and Beam safeguards: `../memory/curated-records.json` and `WORKING_RULES.md`.
- Prior class/market analysis: `../operations/`, dated historical evidence.
- Beam's separate repository: https://github.com/Pinkpelara/Little-Beam (private). This migration does not replace or modify Beam.

Evidence: original `output/birthday-invoice-flow-20261022/STATUS.md`, `output/birthday-release-20261021/forward-booking-release-20261022.md`, October 21 program-release memory and the two Leap chats listed in WORKING_RULES. Private proof and raw customer-bearing records are excluded from the public repository.
