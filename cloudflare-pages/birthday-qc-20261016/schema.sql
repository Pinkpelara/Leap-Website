CREATE TABLE IF NOT EXISTS parties (
 id TEXT PRIMARY KEY, invoice TEXT UNIQUE NOT NULL, email TEXT NOT NULL,
 start_at INTEGER NOT NULL, booked_at INTEGER NOT NULL, package TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'active', version INTEGER NOT NULL DEFAULT 1,
 details TEXT, extras TEXT NOT NULL DEFAULT '{}', roster TEXT NOT NULL DEFAULT '[]',
 child_name TEXT NOT NULL DEFAULT '', legacy INTEGER NOT NULL DEFAULT 0,
 updated_at INTEGER NOT NULL, source_message TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
 id TEXT PRIMARY KEY, party_id TEXT, kind TEXT NOT NULL, due_at INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending', attempted_at INTEGER, sent_at INTEGER,
 provider_id TEXT, error TEXT
);
CREATE INDEX IF NOT EXISTS messages_due ON messages(status,due_at);
CREATE TABLE IF NOT EXISTS source_messages (id TEXT PRIMARY KEY, received_at INTEGER NOT NULL, result TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS waivers (id TEXT PRIMARY KEY, party_id TEXT NOT NULL, child_name TEXT NOT NULL, parent_name TEXT NOT NULL, submitted_at INTEGER NOT NULL, legal_version TEXT NOT NULL, payload TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS party_waivers ON waivers(party_id);
CREATE TABLE IF NOT EXISTS state (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, party_id TEXT, action TEXT NOT NULL, at INTEGER NOT NULL, detail TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, kind TEXT NOT NULL, expires_at INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0);
-- Local review records only. No live invoice sender is enabled in this draft.
CREATE TABLE IF NOT EXISTS invoice_previews (party_id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, status TEXT NOT NULL, payload TEXT NOT NULL, updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS party_invoices (party_id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', updated_at INTEGER NOT NULL, attempted_at INTEGER, sent_at INTEGER, provider_id TEXT, invoice_number TEXT, error TEXT);
CREATE INDEX IF NOT EXISTS party_invoices_pending ON party_invoices(status,updated_at);
