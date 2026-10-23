# Leap Gymnastics project hub

Updated October 23, 2026 for the computer handoff: reviewed birthday source, portable build/tests, curated memory, working rules, Uplifter references and public website captures.

## Start here

- [Current state and known gaps](docs/CURRENT_STATE.md)
- [New computer setup](docs/NEW_COMPUTER.md)
- [Do's, don'ts and protected systems](docs/WORKING_RULES.md)
- [Uplifter knowledge base](docs/uplifter/KB.md)
- [Migration coverage](docs/CLOUD_MIGRATION.md)
- [Curated project memory](memory/curated-records.json)

| Area | Location |
|---|---|
| Birthday, consent, portal, invoice and recovery source | [Birthday application](cloudflare-pages/birthday-qc-20261016/) |
| Build and offline tests | [tools](tools/), package.json and pnpm-lock.yaml |
| Current public website | [October 23 snapshot](snapshots/2026-10-23/README.md) |
| Previous public website | [September 11 snapshot](snapshots/2026-09-11/README.md) |
| Historical CMS files | [site-content](site-content/) |
| Historical analysis | [operations](operations/) |
| Original logos, brochure, invitation maker and SEO notes | [Asset archive](archive/README.md) |
| Portable Tencent runtime | [tools/tencent-memory](tools/tencent-memory/) |
| Earlier briefs | [docs](docs/), superseded where they conflict with current state |
| Beam repository (private) | [Little-Beam](https://github.com/Pinkpelara/Little-Beam) |

Use Node 22.16+, install from the lockfile and run pnpm test. Tests are synthetic and do not deploy or send customer messages.

This is a public source/reference handoff, not a complete backup of private business records or hosted databases. Credentials, browser sessions, raw chats, signed waivers and customer data are excluded. One private reservation override uses a synthetic fixture; restore authorized private configuration before deployment. The live site and Beam were not changed by this migration.
