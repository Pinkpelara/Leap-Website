# Codex brief: Leap Gymnastics birthday-party workflow

Read this whole file before writing code. Everything under "Verified" was checked against the live site, the owner's Uplifter admin, a real invoice email and a real form submission on 2026-09-29. Everything under "Unverified" was not. Do not treat the second group as fact.

Reference files (in `docs/reference/`):
- `live-birthday-page-2026-09-29.txt`: verbatim copy of the live Birthday Parties page. This is the language source of truth.
- `current-details-form-fields.md`: what the current Cloudflare details form asks and how it behaves.
- `uplifter-invoice-email.sample.txt`: sanitized layout of the Uplifter invoice email (fake data).

---

## 0. Rules for this job

1. **Work in phases.** Phase 1 is fully specified and unblocked: do it. Phase 2 is blocked on owner answers (section 11): do not start it, and do not guess.
2. **Never invent policy.** Parents will read what you build. Use sentences from the live page. Anything not on the live page is listed in section 4 as "unpublished" and needs the owner's sign-off before it is shown to parents.
3. **Do not touch legal text.** The Participant Consent Form's agreement and risk text must be copied byte-for-byte from the deployed source. Do not retype, reflow, summarize or "improve" it.
4. **No secrets, no real personal data in the repo.** That includes the Web3Forms access key (currently visible in the deployed page's script), any Resend/API key, real names, emails, phones, invoice numbers, card details. Use fake data like `Jane Sample` / `example.com` in tests.
5. **Use the owner's vocabulary** (section 4).
6. **Prices are plus HST (13%).** Every dollar amount shown to a parent that is not already HST-inclusive must say so, matching the live page.
7. Small, reviewable commits. Every pricing rule has a unit test. Say plainly in the PR what you did not verify.

---

## 1. Goal

Leap sells birthday parties through Uplifter (booking + $100 deposit), then relies on a Cloudflare form (details) and a Cloudflare form (consent). Today the owner must remember to send parents the form links after each booking, the details form asks far too much, and the loose questions invite last-minute requests. Target: a parent never waits for the owner to send anything, the form is short and closed-ended, the deadline enforces itself, and the owner only sees exceptions.

Success looks like: fewer than about 11 questions on the details form, no free-text way to make a request, an automatic price, a staff email that fits on one screen, and (Phase 2) links and reminders that send themselves.

---

## 2. Verified current state

### 2.1 Website (https://www.leapgymnastics.ca/birthday-parties/), Uplifter-hosted CMS, not in this repo

- Packages (all prices plus HST):

| | Basic $350 | Premium $550 | Deluxe $750 |
|---|---|---|---|
| Participating children included | up to 10 | up to 16 | up to 20 |
| Two-hour party | 60 min gymnastics + 60 min celebration | 75 + 45 | 75 + 45 |
| Space | Designated celebration area, no private party room | Private party room throughout booking | Private party room throughout booking |
| Only party during booking | No | Yes | Yes |
| Balloon décor | Not included | Small tabletop balloon arrangement on a stand | Custom half balloon garland |
| Balloon colours | none | one: white, pink, blue, gold, purple or green | one or two of the same six |
| Birthday child's gift | Loot bag | Loot bag + surprise birthday gift | Loot bag + upgraded surprise birthday gift |
| Guest loot bags | + $7 each | + $7 each | Included: one per participating child, up to 20 total including the birthday child |
| Beverage station (coffee, tea bags, juice, water) | Not available | **+ $40** | Included |
| Additional children (max 24 total) | + $15 each | + $20 each | + $25 each |
| Themed balloon upgrade | not available | not available | + $80, subject to availability and staff confirmation; balloon décor only, not full themed party décor |
| Extra celebration time | + $40 per 30 minutes, subject to availability and staff confirmation; no additional gymnastics or equipment use (all packages) | | |

- Plates, cups, napkins, forks and cleanup are included in all three. Families provide all food and cake.
- "Request paid add-ons before your party; staff confirmation is required."
- New bookings: Saturdays and Sundays, 1:30–3:30 PM. "Existing bookings retain their confirmed times and package inclusions."
- Deposit: "A $100 deposit is required at the time of booking to hold your date. The remaining balance, HST, any approved add-ons and any applicable late-departure charges are finalized with staff and paid during the party by e-transfer to info@leapgymnastics.ca."
- Cancellations and changes: minimum 15 days' notice; deposit refundable only if that notice is met; all changes subject to facility availability.
- Details form deadline: "no later than 7 days before your party".
- Consent: every participating child needs a Participant Consent Form completed by their own parent or guardian before entering the gym; families are asked to share the link with invited families.
- The eight "Party Information" sections: Arrival, Food, Decorations, Hosting your party, Schedule & Participation, Parent & Guest Access, Footwear, Party end time. Full text is in the reference file. Arrival: host families may arrive up to 10 minutes early to drop off food, cake and party items; guests arrive at the start time. Footwear: parents and guests must wear socks in the viewing area and party room. Late departure: $40 plus HST per additional 30 minutes or part thereof.

### 2.2 Uplifter (owner's admin, read-only inspection)

- One program per month, SKU `BDAY-YYYY-MM` (October 2026 = program id 170 through June 2027 = id 178; September 2026 was not enumerated). Category "Birthday Parties", season "Birthday Parties 2026-2027".
- Each program: flat fee **$100**, fee description "$100 birthday party deposit", drop-in enabled at $100, max registrations 1 and max drop-in registrations 1 (this appears to mean one booking per event date; not confirmed), Ontario HST 13% ticked with "Charge at Checkout". Registration opens 2026-06-01, closes at month end. There is **no package choice and no custom question** on the program today.
- **Verified from a real invoice: the deposit is charged as $100.00 + $13.00 HST = $113.00 by card.** The live page and the program text say only "$100".
- The program description parents see says the balance is "paid through Uplifter at the party". The live page and the Cloudflare form say e-transfer to info@leapgymnastics.ca. **These conflict.**
- October 2026 events include two legacy 1:00–3:00 PM dates (Oct 4, Oct 17) alongside 1:30–3:30 PM dates. Removed dates are intentional.
- Custom fields (Global Settings, Custom Fields) already exist: participant fields (emergency contact name and phone, medical notes, allergies or medications), invoice fields ("How did you hear about Leap?", "Referral Name"), invoice item fields (Fee Waiver Code plus three competitive-program questions).
- **Invoice Item Fields can be a "Dropdown Box".** The creation form has: Field Name, Help Text, "On Checkout and Invoices", "Include on invoices completed from date", "Link To" (applies when a line item matches requirements; default "All Products"), Field Type (Whole Numbers, Free Form Text, Date, Dropdown Box, File Upload, Image Upload, Serial Number, Instructor Selector), and for a dropdown: Options, "Allow multiple values", "Required", "Allow Free Form". No per-option price field was visible.
- Policies (Forms & Documents) can be required, applied to a participant, limited to specific products, presented at invoice, set to re-accept each time, emailed for acceptance, and their responses download as XLSX. Existing: the Gymnastics Ontario consent policy (all invoices) and a competitive contract (one product).
- Reports include "Registration Custom Fields Report - Detailed by Invoice Line Item".
- Checkout notifications can be sent to an email alias. No API, webhook or Zapier setting was found.

### 2.3 The Uplifter invoice email (a possible trigger for Phase 2)

Sent from `no-reply@leapgymnastics.uplifterinc.com` to `info@leapgymnastics.ca`. Contains invoice number, PAID status, parent name/email/phone/address, participant (the birthday child) first and last name, program name, the event date and time as `[YYYY-MM-DD h:mm AM|PM]`, the totals, and any invoice item fields printed under the line item. See the sanitized fixture. It does not contain package, guest count, food or add-ons.

### 2.4 Cloudflare forms

- Details form: see `current-details-form-fields.md`. 7 steps, 36 answered items on a Deluxe example, Web3Forms backend, no booking verification, free date entry, legacy times shown to everyone, "Not sure yet" accepted, free-text food and extra-time answers, eight separate agreements whose full legal text is pasted into the staff email.
- Consent form: no link to any party, so submissions cannot be counted per party.

---

## 3. Unverified (do not assume)

- Which mail system hosts info@leapgymnastics.ca, and whether leapgymnastics.ca DNS is on Cloudflare.
- Whether Uplifter's "Link To" accepts a category or program (assumed like the requirement tags on subscription products). The owner should test it: create the field, then confirm a birthday invoice shows it and a class invoice does not.
- Whether the Uplifter invoice email's raw HTML matches the fixture (the fixture is from a printed PDF).
- Whether the deposit is credited at $100 pre-tax in the owner's accounting. The pricing rule below assumes so.
- Whether the celebration follows the gymnastics portion (likely, since the current form asks about decorations "during gymnastics activities", but the live page does not say).
- Whether the Uplifter knowledge base (learn.uplifterinc.com) documents anything beyond what the admin showed. It sits behind a bot challenge and was not read.
- The seating, storage and adult-count rules (see section 4).

---

## 4. Language and content rules

**Use:** Birthday Party Details Form, Participant Consent Form, celebration time / celebration area, gymnastics portion, host family / birthday family, party room, viewing area, staff confirmation, subject to availability, finalized with staff, scheduled or staff-approved end time, "our team", "Leap coaches", "Leap Gymnastics".

**Avoid:** "party page" (invented, not the owner's term), "waiver" in parent-facing text (the site says Participant Consent Form), "extras", anything cutesy.

**Tone:** plain, short, policy-style, warm but firm. Same as the live page. No emoji, no exclamation marks in policy text.

**Unpublished rules.** These are not on the live site. Do not show them to parents until the owner adds them to the site (Codex may draft the site text in `docs/site-copy.md`; it does not publish it):
1. Tables and seating are fixed and cannot be added.
2. Leap cannot store, refrigerate or freeze party food (owner said the facility cannot reasonably accommodate it; exact wording is theirs to choose).
3. The details form closes 7 days before the party (the site says only "no later than 7 days before").
4. Coaches cannot take requests on the day.
5. The deposit is $100 + HST ($113 at checkout).
6. Any cap or guidance on adults attending.
7. How food deliveries during the party are handled (see section 6, question 8).

---

## 5. Phase 0: owner tasks in Uplifter (Codex does not do these; build on them)

Give the owner this checklist in the PR description.

1. **Create an Invoice Item Field** (Global Settings, Custom Fields, Invoice Item Fields, New):
   - Field Name: `Party Package`
   - Help Text: `Your $100 + HST deposit is credited toward your package. Full inclusions are on the Birthday Parties page.`
   - Where it appears: On Checkout and Invoices
   - Link To: the Birthday Parties category (or the `BDAY-*` programs); otherwise it will ask every registration
   - Field Type: Dropdown Box
   - Options (exact text): `Basic - $350 + HST`, `Premium - $550 + HST`, `Deluxe - $750 + HST`
   - Allow multiple values: No. Required: Yes. Allow Free Form: No.
   - Verify: a birthday checkout shows it, a class checkout does not, and the answer prints on the invoice email under the line item.
2. **Fix the program description on all ten monthly programs** to the text in section 8.1. This removes the "paid through Uplifter" conflict and states the HST.
3. Update the fee description to `$100 + HST birthday party deposit (credited toward your package)`.
4. Confirm the 1:00–3:00 PM legacy events are booked, so a new parent cannot select them.
5. Send Codex or the maintainer a raw `.eml` of one Uplifter birthday invoice email (Phase 2 dependency).

---

## 6. Phase 1: what Codex builds now

Suggested layout: `apps/details-form/`, `apps/consent-form/`, `packages/pricing/`, `docs/`. Static Cloudflare Pages sites, no framework required. If the current source of the forms exists elsewhere, use it and say where; otherwise rebuild from the field lists and text in the reference files, and fetch the deployed pages to copy legal text verbatim.

### 6.1 Pricing module (`packages/pricing`), pure functions plus tests

Inputs: package (`basic|premium|deluxe`), participating children (1–24, includes the birthday child), guest loot bags requested, beverage station requested (Premium only), themed balloon upgrade requested (Deluxe only), extra celebration time in 30-minute units requested.

Rules (all from the live page):
- Base price: 350 / 550 / 750.
- Included children: 10 / 16 / 20. Extra children = max(0, children − included), at 15 / 20 / 25 each. Reject more than 24.
- Guest loot bags: Basic and Premium, $7 each, at most children − 1 (the birthday child already has a bag). Deluxe includes one per participating child up to 20; for Deluxe, bags beyond 20 are $7 each, at most max(0, children − 20).
- Beverage station: Premium $40; Basic not available; Deluxe included.
- Themed balloon upgrade: Deluxe only, $80.
- Extra celebration time: $40 per 30 minutes, all packages.
- Statuses: extra children and loot bags are **confirmed** amounts; themed balloon upgrade, beverage station and extra time are **requests** (the site says paid add-ons need staff confirmation). Return two figures: `confirmedBalance` and `balanceIfAllApproved`.
- Balance = (subtotal − 100) × 1.13, where the $100 deposit is credited pre-tax because HST was already charged at checkout ($113 paid). Round half up to cents once, at the end. Unverified with the owner's accounting; make the deposit credit a named constant.
- Never return a negative balance.

Required test cases (values computed by hand):
| Case | Subtotal (confirmed) | Balance (confirmed) | If all requests approved |
|---|---|---|---|
| Basic, 10 children, nothing else | 350.00 | 282.50 | 282.50 |
| Basic, 12 children, 3 guest loot bags | 350 + 30 + 21 = 401.00 | 340.13 | 340.13 |
| Premium, 18 children, 5 guest loot bags, beverage station requested | 550 + 40 + 35 = 625.00 | 593.25 | 638.45 (subtotal 665) |
| Deluxe, 24 children, 4 loot bags beyond 20, themed upgrade and 30 min extra requested | 750 + 100 + 28 = 878.00 | 879.14 | 1014.74 (subtotal 998) |

Also test: 25 children rejected; Premium beverage station on Basic rejected; Deluxe with 20 children and 0 extra bags has no loot cost.

### 6.2 New Birthday Party Details Form (`apps/details-form`)

Goal: about 11 questions, closed answers, mobile-first, one screen per logical group, no wizard of 7 steps.

**Prefill from the emailed link** (Phase 1 uses query parameters, not personal data): `date`, `time`, `package`. Do **not** put names, emails or phones in the URL. If parameters are missing, show a package selector and a date/time selector limited to the two published slots (Saturday or Sunday, 1:30–3:30 PM). Remove the three legacy time options for new submissions.

**Contact block** (typed, because no data source exists in Phase 1): parent/guardian name, email used for booking, phone, birthday child's full name.

**Questions:**
1. Birthday child's age on party day. Number.
2. Package. Read-only when prefilled; a radio with the "what's included / not included" comparison from section 2.1 when not. If prefilled, add: "Package changes are subject to availability and staff confirmation. Email info@leapgymnastics.ca." (Wording adapted from "All changes are subject to facility availability.")
3. Participating children including the birthday child. Number 1–24. Show included count, per-child fee and live extra-children cost.
4. Adults attending. Number. (No cap. See section 11.)
5. Age range. Dropdown: Under 4, 4–5, 6–8, 9–12, 13+, Mixed. (Proposed options; owner to confirm.)
6. Balloon colour(s). Premium: one of white, pink, blue, gold, purple, green. Deluxe: one or two of the same six. Basic: hide.
7. Food. Checklist: Pizza, Sandwiches, Fruit, Packaged snacks, Cake, Cupcakes. Plus one optional short field, "Other simple item" (max 60 characters), with the published food rule shown beside it. **No free-text food plan.**
8. Food delivered to the gym? Yes/No; if Yes, expected time. Flag in the staff email. (The live page does not address deliveries; see section 11.)
9. Guest allergies or food restrictions. Optional text, max 200 characters.
10. Add-ons block, each a request. Heading text: "Add-ons are requests. Staff confirmation is required, subject to availability." Items: guest loot bags (quantity; hidden text for Deluxe up to 20 included); beverage station + $40 (Premium only); themed balloon upgrade + $80 (Deluxe only; "balloon décor only, not full themed party décor"); extra celebration time + $40 per 30 minutes, choose none / 30 / 60 minutes ("no additional gymnastics or equipment use"). Extra time and the themed upgrade must display "Not confirmed until you receive an approval email."
11. Safety note for coaches. Optional, max 300 characters, labelled: "Anything coaches must know about a participating child's ability to participate independently or stay safe. This is not a request box."

**One agreement.** A single required checkbox: "I have read and agree to the Party Information on the Birthday Parties page." Render the eight Party Information sections (text from the reference file) above it, collapsible but visible by default. Remove the separate waiver, schedule, guest-access, socks, decorations, end-time, payment and final-confirmation checkboxes, and the independent-participation Yes/No/"Not sure yet" question (the schedule and participation text already states the requirement).

**Removed entirely:** decoration questions, drinks question, cake/cupcakes question (covered by the food checklist), free-text age range, free-text extra support, free-text extension request, "Not sure yet" anywhere. The live page currently says the form confirms "decoration details"; flag that sentence in `docs/site-copy.md`.

**Deadline.** Compute `deadline = party date − 7 days, 11:59 PM America/Toronto`. Before it, show the deadline on the form. After it, show the closed message (section 8.5) and hide the form. This is client-side and therefore advisory only; say so in the PR. Real enforcement is Phase 2.

**Submission.** Keep Web3Forms as the backend for Phase 1 (key from environment/config, not committed). Honeypot field for spam. On success show: "Thank you. Our team will confirm your package and any add-ons. Your estimated balance at the party is $X (confirmed) and $Y if all requested add-ons are approved. It is paid by e-transfer to info@leapgymnastics.ca during the party."

**Acceptance:** works at 360 px width; keyboard-accessible with labels and error text; no console errors; every pricing figure comes from the pricing module; a Deluxe submission with the test-case-4 inputs shows 879.14 and 1014.74.

### 6.3 Staff email (Web3Forms payload)

One compact plain-text email, no duplicate table, no legal text. Subject: `Party Details: <child> — <package> — <date> <time>`. Sections in this order:
1. **REVIEW** (only if any apply, one line each): adults greater than participating children; delivery during party; extra time requested; themed upgrade requested; beverage station requested; safety note present; "other" food item present; more than the package's included children.
2. **Party:** date, time, package, child (age), parent, email, phone.
3. **Numbers:** participating children, adults, age range.
4. **Décor:** balloon colour(s).
5. **Food:** checklist, other item, delivery yes/no and time, allergies.
6. **Add-ons requested:** each with status "requested".
7. **Balance:** confirmed and if-all-approved, with the line items used.
8. **Safety note:** verbatim.
9. **Agreement:** `Agreed to Party Information (version <date>) at <timestamp>`. Version string is a constant that changes when the live text changes.

### 6.4 Participant Consent Form (`apps/consent-form`)

- Keep every word of the legal text, all fields, and the existing behaviour.
- Add support for an optional `party` query parameter (party date, e.g. `2026-10-17`, plus package-free label). When present, prefill "Program or class" with `Birthday party <date>` and include it in the submission subject so consent forms can be counted per party. Do not add personal data to the URL.
- Do not add or remove agreement wording. If the deployed source cannot be recovered, stop and ask the owner for the original file instead of retyping the legal text.

### 6.5 Copy documents (no publishing)

Create `docs/site-copy.md` containing exact replacement text for the Uplifter program description, the fee description, the birthday page (the deposit line with "$100 + HST ($113 at checkout)", the sentence about decoration details, and the new unpublished rules once approved) and an FAQ block that reuses existing published wording only. Mark each item "requires owner approval".

---

## 7. Phase 2 (blocked): automation Worker

Do not start until the owner answers questions 1–5 in section 11.

Requirements:
- **Trigger:** Uplifter invoice email for a birthday program, paid, containing an event date/time. Parse against a raw `.eml` from the owner, with the sanitized fixture kept as a unit-test fixture. Unparseable or unexpected emails must not create records; they alert the owner.
- **Idempotent** on invoice number; ignore non-birthday programs and unpaid invoices.
- **Storage:** Cloudflare D1. Party: invoice number, program SKU, event date and time (America/Toronto), participant name, parent email and phone, package (from the `Party Package` invoice item field once it exists), opaque access token, status, timestamps, reminder flags, submitted details JSON, lock state.
- **Emails** (section 8): booking (within minutes), reminders at 14 and 8 days if the details are incomplete (owner to confirm), party-day email at 2 days, daily staff digest of parties in the next 7 days with exceptions. Default to **dry-run** (log only) behind a flag; never send to real parents from tests or previews.
- **Lock:** the details form is open until `party date − 7 days, 11:59 PM America/Toronto`, then read-only; the owner can unlock a single party from an admin view.
- **Access:** opaque token in the link (no personal data in URLs). Server-side validation of the same rules as the pricing module.
- **Consent form counts:** consent submissions tagged with the party count against participating children; the party-day email shows "X of N completed".
- **Existing bookings** must not receive automated emails unless the owner runs an explicit backfill.
- **Admin:** simple view of upcoming parties, exceptions, and unlock; protect with Cloudflare Access or a strong token. No PII in logs.
- **Email sending:** provider is an owner decision; use a verified sending domain (SPF/DKIM). Reply-To is info@leapgymnastics.ca.

---

## 8. Exact copy

### 8.1 Uplifter program description (each monthly program) and fee description

Description:
> Reserve a two-hour birthday party slot with a $100 + HST deposit ($113 at checkout). After booking, please complete the Birthday Party Details Form no later than 7 days before your party so our team can confirm your package, participating child count, food plans and any optional add-ons. The remaining balance, HST, any approved add-ons and any applicable late-departure charges are finalized with staff and paid during the party by e-transfer to info@leapgymnastics.ca. We require a minimum of 15 days' notice for any cancellations or date change requests; the deposit is refundable only if this notice is met.

Fee description: `$100 + HST birthday party deposit (credited toward your package)`

### 8.2 Booking email (Phase 2, sent automatically)

Subject: `Your Leap birthday party is booked: next step`

> Hi [Parent first name],
> Your birthday party for [Child first name] is booked for **[Saturday, October 17, 1:30–3:30 PM]**. Your $100 + HST deposit has been received.
> **Next step:** please complete your Birthday Party Details Form no later than **[October 10]**. It takes about three minutes and is already filled in with your booking. [Complete the Birthday Party Details Form]
> Every participating child must also have a Participant Consent Form completed by their own parent or guardian before entering the gym. Please share this link with your invited families: [Participant Consent Form]
> Our team will then confirm your package and any add-ons. Questions? Reply to this email.
> Leap Gymnastics

### 8.3 Reminder (14 and 8 days out, only if incomplete)

Subject: `Your Birthday Party Details Form is due [date]`

> Hi [Parent first name], [Child first name]'s party is on [date]. Your Birthday Party Details Form isn't complete and is due no later than **[date]**. [Complete the form]

### 8.4 Party-day email (2 days before)

Subject: `[Child first name]'s party is [Saturday]`

> Your party is **[date], [start]–[end]**. Host families may arrive up to 10 minutes before the scheduled party start time to drop off food, cake and party items. Guests should arrive at the scheduled party start time.
> **Participant Consent Forms:** [X] of [N] completed. Please share the link with any families who haven't: [link]
> Leap coaches lead and supervise gymnastics. You'll host the celebration, serve food and cake and assist your guests, and you must remain on site throughout the party. Parents and guests must wear socks in the viewing area and party room.
> Everything must be out by **[end time]**. Late departure costs $40 plus HST for each additional 30 minutes or part thereof.
> Balance: **$[X]** by e-transfer to info@leapgymnastics.ca during the party.

### 8.5 Closed-form message

> Your Birthday Party Details Form is closed. Our team already has your details. If something is urgent, email info@leapgymnastics.ca. Changes are subject to facility availability.

### 8.6 Auto-reply for a dedicated parties address (optional, owner to confirm the address and response time)

> Thanks for your message. **Food:** simple children's party food only, and no ice cream. **Extra time:** available on request, $40 per 30 minutes, subject to availability and staff confirmation. **Late departure:** $40 plus HST for each additional 30 minutes or part thereof. **Changes and cancellations:** 15 days' notice, subject to facility availability. Otherwise we'll reply within [1 business day].

The seating, storage and no-requests-on-the-day sentences are intentionally excluded until published.

---

## 9. Do not

- Do not change prices, inclusions, deadlines or policy wording. If the live page and this brief disagree, the live page wins; report the difference.
- Do not add a new free-text field that lets a parent make a request.
- Do not publish, email or deploy anything to real parents. Preview only.
- Do not scrape or log in to Uplifter. Everything needed is in this brief and the reference files.
- Do not commit real personal data, API keys or the Web3Forms key.
- Do not alter the Participant Consent Form's legal text.

---

## 10. Definition of done for Phase 1

- Pricing module with the four required tests plus the rejection tests, passing.
- New details form meeting section 6.2, with screenshots at desktop and 360 px in the PR.
- Staff email matching section 6.3 for a Deluxe example, pasted in the PR (fake data).
- Consent form unchanged except the optional `party` parameter; a diff showing no change to legal text.
- `docs/site-copy.md` drafted.
- PR description lists: the Phase 0 checklist, the unpublished rules needing owner approval, everything in section 3 that was not verified, and what is client-side only.

---

## 11. Open decisions for the owner (Codex must not assume answers)

1. Which system hosts info@leapgymnastics.ca (Google Workspace, Zoho, other)?
2. Is leapgymnastics.ca's DNS on Cloudflare?
3. Which email provider for sending (and is a sending domain available)?
4. Can the owner provide a raw `.eml` of a birthday invoice email?
5. Approve the reminder schedule (14 and 8 days, party-day email at 2 days)?
6. Is the $100 deposit credited pre-tax ($113 already paid)? Confirm the balance formula.
7. Cap or guidance on adults attending?
8. Are food deliveries during the party allowed, and who receives them?
9. Extra time: allowed increments and maximum?
10. Age-range options and the "Other simple item" food field: keep or remove?
11. Approve or reject each unpublished rule in section 4.
12. Confirm whether the celebration follows the gymnastics portion, so the party-day email can include a timeline.
13. Is the package changeable after booking, and by whom?
