# New computer setup

Clone https://github.com/Pinkpelara/Leap-Website and read CURRENT_STATE.md and WORKING_RULES.md. Node 22.16+ is required for node:sqlite. Install pnpm, then from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm test
```

The tests build locally, use in-memory SQLite and synthetic mail/provider responses, and require no credentials. `pnpm build` writes the Worker and existing-pages router to ignored `output/birthday-qc-20261016/`. Nothing deploys automatically. The obsolete private receipt-preview generator was deliberately excluded; the delivery regression suite retains its synthetic tests without rendering customer-specific previews.

## Restore searchable project memory

Use absolute paths. Create `.local` on a local disk, then:

```sh
node tools/tencent-memory/scripts/memory.mjs ingest --db /absolute/path/Leap-Website/.local/requirements.sqlite --input /absolute/path/Leap-Website/memory/curated-records.json
node tools/tencent-memory/scripts/memory.mjs search --db /absolute/path/Leap-Website/.local/requirements.sqlite --query "birthday Uplifter Beam" --limit 20
```

Windows accepts absolute `C:/...` paths. Do not put SQLite on a network share. This is the real pinned Tencent VectorStore/FTS implementation, not Memory Hub, a proxy or automatic chat retention. Its provenance and licence are under `tools/tencent-memory/`.

## Production service continuity

The website/CMS, Cloudflare databases and KV, Zoho Mail/Invoice, and Uplifter remain hosted in their accounts. Changing computers does not migrate or erase those services. Sign in through their normal account flows. Reuse the existing database/bindings; do not create empty replacement databases, reset keys or rerun schema blindly.

The public repository intentionally contains no production credentials, database export, signed waivers, customer lists, private form links or browser profile. Secret names are documented in `migration/environment-names.json`; values belong in the existing service secret store. Preserve TOKEN_SECRET and existing private-link routing. Rotating a key as a setup step can break old links.

Before any later deployment, compare against the active deployment, recover the private legacy reservation override, inspect current settings/cutovers and scheduler configuration, back up the active version, and obtain the required deployment scope. The synthetic override in the public copy is not production configuration. No deploy command is included in setup.

The original private Windows project directory and private `.codex/project-data/leap-design` directory must remain available until any separate private backup is complete. GitHub alone is not a complete backup of customer records, service configuration, correspondence, marketing originals or corporate documents. Never upload credentials/browser sessions, even to a private Git repository.
