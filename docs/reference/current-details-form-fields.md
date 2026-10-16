# Current Birthday Party Details Form: what exists today

Source: the deployed page https://leap-birthday-party-form.pages.dev/ (read 2026-09-29, rendered in a browser and read from its inline script).
The repository does not contain this form's source. See CODEX_BRIEF.md section 6 on locating it.

## Shape

- A 7-step wizard: Booking, Package, Participants, Decorations, Food, Add-Ons, Agreement.
- Client-side only. On submit it POSTs JSON to `https://api.web3forms.com/submit`; Web3Forms then emails info@leapgymnastics.ca.
- Subject line: `Birthday Party Details — <child name> (<party date>)`.
- Nothing checks that a booking exists. The party date is a free date input.
- The submission email lists every answer twice (message body, then a table) and pastes the full legal text of each agreement. A Deluxe submission prints as 6 pages.
- Do not copy the Web3Forms access key from the page into this repo or into docs. Keep it in Cloudflare Pages environment configuration.

## Step 1 (Booking) fields

| Field | Type | Notes |
|---|---|---|
| guardian_name | text | duplicates the Uplifter booking |
| booking_email | email | duplicates the Uplifter booking |
| phone | tel | duplicates the Uplifter booking |
| party_date | date | free entry, not validated |
| child_age | number | |
| party_time | radio | Saturday 1:30–3:30 PM; Sunday 1:30–3:30 PM; and three legacy options labelled "(existing bookings only)": Saturday 1:00–3:00 PM, Saturday 4:00–6:00 PM, Sunday 1:00–3:00 PM. All five are shown to every parent. |
| child_name | text | duplicates the Uplifter participant |

## Field labels used in the submission (from the form's LABELS map)

Parent/Guardian Name; Email Address Used for Booking; Best Phone Number for Party Day; Party Date; Party Time; Birthday Child's Full Name; Birthday Child's Age on Party Day; Package; Estimated Number of Participating Children; Estimated Number of Adults Attending; Age Range of Participating Children (free text); Will every participating child be able to participate independently? (answers include "Not sure yet"); Independent participation acknowledgement; Extra support / special consideration (free text);
Basic: Bringing simple tabletop decorations?; Decorations description.
Premium: Balloon Colour Choice; Bringing additional decorations/theme items?; Additional decorations description; Adult setting up decorations during gymnastics activities?
Deluxe: First Balloon Garland Colour; Second Balloon Garland Colour; plus the same three decoration questions as Premium.
Food: Bringing food?; Food Type; Food plan details (free text); Food delivered to gym?; Expected food delivery time; Cake or cupcakes?; Bringing drinks?; Food Guidelines agreement; Allergies or food restrictions.
Add-ons: Optional add-ons (checkboxes); Number of loot bags (or "additional loot bags" for Deluxe); Extended celebration time request (free text); Beverage station confirmed (Premium).
Agreements (each a separate checkbox, each printing its full text into the email): Waiver agreement; Schedule and participation agreement; Parent and guest access agreement; Socks agreement; Decorations agreement; Arrival and departure agreement; Payment agreement; Final confirmation.

A real Deluxe submission had 36 answered items: 6 repeat the Uplifter booking, 10 are tick-box agreements, and about 10 carry information staff use.

## What the reviewed submission showed (no personal data here)

- "Not sure yet" was accepted for independent participation, additional decorations and extra time.
- The food plan (free text) listed sushi, skewers and a candy station under "simple party foods", which conflicts with the published food rule.
- Extra time was requested as free text: "maybe just an extra 30 mins if needed".
- 24 participating children and 25 adults were entered. Nothing caps or flags adults.
- Deluxe with 24 children means 4 extra children at $25 each; 4 extra loot bags at $7; themed balloon upgrade $80 and extra time $40 requested. Staff computed the balance by hand.

## Participant Consent Form (https://leap-participant-consent-form.pages.dev/)

Fields: participant full legal name; date of birth; program or class (optional); contact email; contact phone; three "agree to paragraphs" checkboxes (1–2, 3–4, 5–7); risk-acknowledgement text (15 categories); participant e-signature and date; parent/guardian name, e-signature and date (required if under 18); a confirmation checkbox; a final confirmation checkbox; a link to the original agreement PDF. It has no link to any party. The legal text must be preserved exactly (see brief).
