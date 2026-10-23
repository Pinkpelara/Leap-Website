# Leap working rules

Read `docs/CURRENT_STATE.md`, `docs/WORKING_RULES.md`, and `docs/NEW_COMPUTER.md` before work. Current explicit owner instructions override historical notes. September briefs and dated snapshots are reference evidence, not deployment instructions.

Use Custom CMS content/shared content only for authorized site changes. Never edit Uplifter templates. Preserve Beam's scripts, assets, appearance, placement and interactions. Leave registered or uncertain offerings unchanged. Never let the custom birthday system reject/cancel an Uplifter reservation or alter checkout, payment or availability.

Read relevant official Uplifter KB documentation before changing its configuration. Verify live facts and exact targets. Do only the requested work. Do not send emails, replay jobs, create test bookings or deploy as a setup/test step.

This repository is public. Keep customer records, signed waivers, private links, credentials, browser sessions and raw conversations out of commits. Use synthetic fixtures. Curated memory is in `memory/curated-records.json`; SQLite is local and ignored.

Run `pnpm install --frozen-lockfile`, then `pnpm test` for the birthday application. No production credentials are needed. The public migration contains a synthetic legacy reservation override; consult NEW_COMPUTER before any deployment.
