# Uplifter knowledge base and local rules

Read relevant official documentation before Uplifter changes, then verify the actual account configuration. The owner’s stricter scope and protection rules still apply.

Verified accessible October 23, 2026:

- [Site settings on Club 1.0](https://learn.uplifterinc.com/hc/en-us/articles/202321284-Site-settings-on-Club-1-0): settings and notifications/messages, including invoice messaging controls.
- [Custom fields on Club 1.0](https://learn.uplifterinc.com/hc/en-us/articles/115007952287-Custom-fields-on-Club-1-0): field categories, checkout/invoice presentation and linking fields to applicable offerings.

Local observed implementation on October 22: the birthday package field was required for birthday registrations and appeared at checkout/on invoices. Native invoice messaging used a shared message. No supported per-booking private-link merge field was established. The owner approved email-code verification after clicking the invoice link. That custom portal is Leap code, not a documented Uplifter-native feature.

Read the actual label values: native “Deluxe - …” does not necessarily contain “Deluxe Package.” Do not guess a missing package. Keep Uplifter booking acceptance independent from the custom intake parser.

The saved `native-invoice-message.html` is the October 22 implementation reference, not permission to overwrite global settings. It may apply more broadly than birthday invoices; the intake regression tests ensure a class invoice containing that footer does not become a false party booking.

Local Uplifter guide PDFs and login/support emails were not copied to this public repository. Use the official KB for current platform instructions and WORKING_RULES.md for Leap-specific boundaries.
