# Leap cloud consolidation

Leap-Website is the primary cloud repository. The 2026-09-11 website snapshot remains byte-for-byte unchanged.

## Imported from Leap-Gym

Both work branches were merged with their Git histories:

- `claude/audit-uplifter-site-3nuKq`, e598075d13382c50935e22dbcf3c2559e8566c93: site-content snippets, site-health report and operations analysis.
- `claude/dreamy-volta-s264fj`, 069c67c222dd099539835605fb7df07354388169: birthday-workflow briefs and reference documents.

The website README was kept when resolving the two repositories' initial README conflict. All 15 non-README files from the two Leap-Gym branches were imported without alteration. The original Leap-Gym repository on GitHub remains intact; this consolidation does not delete or change it.

## Still missing from this cloud workspace

The local Leap Codex task history identifies newer work in:

- `Documents\New project`: Cloudflare source, project tools, outputs and supporting files.
- `%USERPROFILE%\.codex\project-data\leap-design`: birthday booking/Zoho invoicing source, preview/build/test scripts, deployment records, screenshots and the requirements.sqlite project-memory database.

Those Windows folders are not accessible to this cloud shell and have not been imported. The website snapshot and imported briefs predate that newer work. Source files, project memory, task history and live service credentials are separate migration items; importing these Git histories does not transfer them automatically.

Transfer the Leap source/artifacts while keeping credentials in secure environment settings. Preserve originals. Inspect archives and compare files before combining them with this repository. Do not run deployment, invoice/email or production-mutation scripts as setup tests.

## Development and validation

The current repository is a public-site reference archive, not an independently runnable CMS or birthday application. Python 3.11+ supports the included public capture tool:

```sh
python3 -m venv /workspace/.venvs/leap-website
/workspace/.venvs/leap-website/bin/python -m pip install -r snapshots/2026-09-11/tools/requirements.txt
/workspace/.venvs/leap-website/bin/python snapshots/2026-09-11/tools/capture.py --help
cd snapshots/2026-09-11
sha256sum --check --quiet SHA256SUMS.txt
```

For a fresh, read-only public capture, run the tool with an output directory outside the tracked snapshot. The existing September snapshot must remain unchanged. Archived forms and registration actions depend on the live service; do not submit archived forms as a smoke test.

Use existing checkouts; cloud tasks are already isolated. Do not create a Git worktree unless explicitly requested. Established Leap preferences include keeping Beam untouched, avoiding templates, auditing the entire site for consistency after site changes, preserving approved wording and existing bookings, and keeping payments by e-transfer.
