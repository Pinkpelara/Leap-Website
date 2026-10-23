# Maintained birthday source

This directory includes the October 22, 2026 native-invoice portal, draft/submission workflow, two reminders and mail/invoice recovery. The date in the directory name is historical. Read ../../docs/CURRENT_STATE.md and ../../docs/NEW_COMPUTER.md.

Build and test from the repository root with `pnpm test`. The migration removed obsolete production bundles and private preview dependencies, made build paths portable, and replaced one private reservation identifier with a synthetic fixture. Do not deploy this public copy without restoring that authorized private configuration and comparing against production.

No live site, Beam, booking or service setting was changed by this GitHub migration.
