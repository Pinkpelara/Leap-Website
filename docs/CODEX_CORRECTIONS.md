# Leap birthday parties: corrections to make in place

You (Codex) already have access to Leap's Uplifter admin, website and forms. Do NOT rebuild anything. Make the smallest edit that fixes each item below, in the place named. Before you save each change, note the current text so it can be reverted. Where an item says "needs owner approval", prepare it and show it; do not publish.

Do not touch: prices, package inclusions, events/dates, registrations, invoices, payments, taxes, the Participant Consent Form's legal text, or any Uplifter setting not named below. Do not send emails. Do not copy personal data (names, emails, phones, invoice numbers, card details) anywhere. If the live website and this document disagree, the live website wins; tell the owner.

## What is verified (checked 2026-09-29)

- Uplifter: ten monthly programs, SKU `BDAY-YYYY-MM`, each a flat $100 "deposit", drop-in style events, one booking per date. The deposit is charged $100.00 + $13.00 HST = $113.00 (HST 13%, "Charge at Checkout").
- The Uplifter invoice email prints the program's **Day/Time** line. It does not print the program Description.
- Settings, Notifications & Messages: "Global Message" (appears on all invoices) is off; "Embed Policy PDFs" (policies on emailed receipts) is off. Both would apply to every invoice including classes, so leave them off.
- Program Description (what parents read before booking) currently says the balance is "paid through Uplifter at the party". The website and the details form say e-transfer to info@leapgymnastics.ca. The website is correct.
- Details form (leap-birthday-party-form.pages.dev): 7 steps, about 36 answers on a Deluxe booking; submits through Web3Forms; the staff email prints every answer twice and pastes full legal text for four agreements; free date entry; three legacy times ("existing bookings only") shown to everyone; "Not sure yet" accepted; free-text food plan and extra-time request.

## A. Uplifter admin: Programs (all ten BDAY programs; use Batch Update if it can set these fields, otherwise edit each)

**A1. Description.** Replace the two wrong phrases only:
- "paid through Uplifter at the party" becomes "paid by e-transfer to info@leapgymnastics.ca during the party"
- "with a $100 deposit" becomes "with a $100 + HST deposit ($113 at checkout)"

**A2. Fee description.** `$100 birthday party deposit` becomes `$100 + HST birthday party deposit (credited toward your package)`.

**A3. Day/Time description (this is what reaches the parent's invoice email).** Make all ten identical (October to December currently say "New bookings: … Existing bookings retain their confirmed times."; January to June are worded differently). New text:

> New bookings: Saturdays and Sundays 1:30pm-3:30pm. Existing bookings retain their confirmed times. After booking, please complete the Birthday Party Details Form no later than 7 days before your party: https://leap-birthday-party-form.pages.dev/

Check how this looks on the public program page and the registration listing (it is shown there as "On … for N events"). If it is too long, cut to the form link only. Do not put the consent link here; see C6. This one line is what stops the owner from having to remember to send the link.

**A4.** Events dated 1:00-3:00 PM or 4:00-6:00 PM are legacy bookings. Report which are unbooked (a new parent could still book them). Do not delete anything.

**A5 (optional, needs owner approval).** Global Settings, Custom Fields, Invoice Item Fields, New: Field Name `Party Package`; Help Text `Your $100 + HST deposit is credited toward your package. Full inclusions are on the Birthday Parties page.`; appears On Checkout and Invoices; Link To the Birthday Parties category or the BDAY programs; type Dropdown Box; options `Basic - $350 + HST`, `Premium - $550 + HST`, `Deluxe - $750 + HST`; multiple values No; Required Yes; Allow Free Form No. Verify a birthday checkout shows it and a class checkout does not. There is no per-option price, so the charge stays $100.

## B. Website: Birthday Parties page

**B1.** "A $100 deposit is required at the time of booking…" becomes "A $100 + HST deposit ($113 at checkout) is required at the time of booking…". Leave the rest of the sentence unchanged.

**B2 (needs owner approval).** Add two sentences to "Party Information" so parents see them before booking. Suggested, in the page's voice:
- Under a new heading "Seating": "Party room and celebration area seating is set for safety and flow. Additional tables and seating cannot be added."
- Append to "Food": "We are not able to store or freeze food or cake, so please bring only what will be served."

**B3 (optional).** Add a photo of each balloon option (Premium tabletop arrangement, Deluxe half garland) beside the "Balloon décor" row. The text is already accurate; the confusion is visual.

**B4 (optional).** FAQ: replace the one-line birthday answer with 4 short answers that reuse existing published wording: food (no ice cream), extra celebration time ($40 per 30 minutes, subject to availability and staff confirmation), late departure ($40 plus HST per 30 minutes or part thereof), changes and cancellations (15 days' notice, subject to facility availability).

## C. Details form: edit in place

Keep the existing layout, look and Web3Forms submission. Use the form's own field names.

**C1. Step 1 (Booking).**
- `party_date`: allow only Saturdays and Sundays between September 2026 and June 2027; helper text "Use the date on your Uplifter booking."
- `party_time`: default to 1:30-3:30 PM. Show the legacy options only when the chosen date is one of the legacy dates found in A4.
- `phone`: remove (Uplifter has it). Add `Uplifter invoice number` (required, helper text "From your Uplifter receipt email"). It lets staff match a submission to a booking in seconds. Needs owner approval since it is a new field.
- Keep `guardian_name`, `booking_email` (it is the reply-to), `child_name`, `child_age`.

**C2. Package step.** Keep. Diff the form's package comparison table against the website table and fix any mismatch; in particular Premium's beverage station is "+ $40" (not included).

**C3. Participants.**
- `age_range`: text becomes a dropdown (Under 4, 4-5, 6-8, 9-12, 13+, Mixed).
- `independent_participation` (Yes / No / Not sure yet): remove. Keep `independent_participation_ack` as one always-shown required tick with its current wording.
- `extra_support`: keep optional; relabel "Anything coaches must know about a child's safety or needs (optional). This is not a request box."
- Keep `num_children`, `num_adults`.

**C4. Decorations.** Keep `prem_balloon`, `deluxe_garland`, `deluxe_garland_second`. Delete `basic_decor_bring`, `basic_decor_desc`, `prem_addl_decor`, `prem_addl_desc`, `prem_setup_adult`, `deluxe_addl_decor`, `deluxe_addl_desc`, `deluxe_setup_adult`. Basic then has no decoration step, so skip it for Basic.

**C5. Food.** Replace `food_type` and `food_desc` with a checklist (Pizza, Sandwiches, Fruit, Packaged snacks, Cake, Cupcakes) plus one optional short field "Other simple item" (max 60 characters) with the published food rule beside it. Delete `cake` and `drinks`. Keep `food_bring`, `food_delivered`, `food_deliv_time`, `allergies`, `food_guidelines_ack`.

**C6. Add-ons.** Keep `*_addons` and `*_loot_qty`. Replace each `*_ext_desc` free text with a dropdown: None / 30 minutes / 60 minutes, and the text "Not confirmed until you receive an approval email." Replace the success screen text with: "Thank you. Our team will confirm your package and any add-ons. Every participating child must also have a Participant Consent Form completed by their own parent or guardian before entering the gym. Please share this link with your invited families: https://leap-participant-consent-form.pages.dev/".

**C7. Agreements (needs owner approval).** Reduce eight ticks to three: (1) `ack_waiver` unchanged; (2) one combined tick replacing `ack_participation`, `ack_guest_access`, `ack_socks`, `ack_decor`, `ack_endtime`, `ack_payment`, shown under the six existing texts word for word so no wording is lost; (3) `food_guidelines_ack` unchanged. Drop `ack_final`.

**C8. Staff email (small code edits).**
- In `formatAnswer`, stop pasting the full agreement text: return "Agreed" instead of "Agreed: " + text.
- Stop sending each answer twice: send either the summary `message` or the field table, not both.
- Put a REVIEW line at the top when any of these apply: adults exceed participating children; food delivered during the party; extra time requested; themed balloon upgrade requested; a safety note is present; an "other" food item is present.

**C9 (optional).** Show an estimated balance on the success screen and in the staff email using only the website's prices: base price, plus extra children ($15 / $20 / $25 above 10 / 16 / 20, maximum 24), plus guest loot bags at $7 (not for Deluxe up to 20), plus Premium beverage station $40, then (subtotal − $100 deposit) × 1.13. Show approvals-pending items (themed upgrade $80, extra time $40 per 30 minutes) as a second "if approved" figure. Assumes the $100 is credited before tax (the $13 HST was already paid); needs owner confirmation. Test: Deluxe, 24 children, 4 extra loot bags = subtotal 878.00, balance 879.14; with themed upgrade and 30 minutes extra = 1014.74.

**C10 (optional).** Client-side: if today is after party date minus 7 days, show "Your Birthday Party Details Form is closed. Our team already has your details. If something is urgent, email info@leapgymnastics.ca. Changes are subject to facility availability." This is advisory only; say so.

## D. Consent form

Leave the form and all legal text untouched. Text-only fix on the website (B-page consent sentence): add "In 'Program or class', enter 'Birthday party' and the birthday child's name so our team can match forms to the party."

## E. Process (owner and staff)

1. A3 replaces manually sending the details-form link. C6 replaces manually sending the consent link.
2. Weekly, 5 minutes: compare birthday bookings for the next 14 days (Uplifter, Reports, Registered Participants for the BDAY programs) with the details-form emails received; chase only the missing ones.
3. Canned replies for the four repeat requests, using only published wording (extra time, late departure, food rules, changes and cancellations). Add seating and storage replies only after B2 is approved.
4. Automation (reminders, an automatic lock, an exceptions list) is a later phase and needs three answers: which system hosts info@leapgymnastics.ca, whether leapgymnastics.ca DNS is on Cloudflare, and a raw copy of one Uplifter invoice email.

## Report back

For every item: done / not done / needs approval, the exact before and after text, and anything you could not verify (in particular whether A3's text displays well on the public pages and whether Batch Update can set these fields).
