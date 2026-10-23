#!/usr/bin/env node
/** Local CLI using the pinned, unmodified TencentDB VectorStore implementation.
 * Input is an explicitly named JSON array, never automatic conversation capture.
 * No HTTP clients, provider credentials, background service, or proxy configuration.
 */
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { VectorStore, buildFtsQuery } from '../vendor/tencent/MemoryCore/src/core/store/sqlite/memory-store.js';

const SCOPE = Object.freeze({ teamId: 'local-project', agentId: 'project-assistant', userId: 'local-curator', taskId: 'explicit-requirements' });
const SOURCE_COMMIT = '0468a2a5b50eaafc54758ed1e2e6609472e5b6ce';
const MAX_INPUT_BYTES = 2 * 1024 * 1024;
const logger = { info: () => {}, debug: () => {}, warn: text => console.error(String(text)), error: text => console.error(String(text)) };

function fail(message) { throw new Error(message); }
function parseArgs(args) {
  const command = args.shift();
  if (!['ingest', 'search', 'check'].includes(command)) fail('Usage: memory.mjs ingest --db ABS --input ABS_JSON | search --db ABS --query TEXT [--limit 1..20] | check --db ABS');
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    if (!['--db', '--input', '--query', '--limit'].includes(key) || i + 1 >= args.length || Object.hasOwn(options, key)) fail('Unknown, repeated, or incomplete option: ' + key);
    options[key] = args[i + 1];
  }
  const allowed = command === 'ingest' ? ['--db', '--input'] : command === 'search' ? ['--db', '--query', '--limit'] : ['--db'];
  for (const key of Object.keys(options)) if (!allowed.includes(key)) fail(key + ' is not supported for ' + command);
  return { command, options };
}
function absoluteFile(value, label, diskOnly = false) {
  if (typeof value !== 'string' || !value.trim() || !path.isAbsolute(value) || /^[a-z]+:\/\//i.test(value) || /[\0\r\n]/.test(value)) fail(label + ' must be an absolute filesystem path, not a URL.');
  const resolved = path.resolve(value);
  if (diskOnly && /^[/\\]{2}/.test(resolved)) fail('SQLite database must be on a local disk, not a network share.');
  if (fs.existsSync(resolved)) {
    if (!fs.statSync(resolved).isFile()) fail(label + ' must be a regular file.');
    if (diskOnly && /^[/\\]{2}/.test(fs.realpathSync(resolved))) fail('SQLite database must resolve to a local disk.');
  }
  return resolved;
}
function stringField(record, field, max) {
  const value = record[field];
  if (typeof value !== 'string' || !value.trim() || value.length > max || value.includes('\0')) fail('Each record needs a nonempty ' + field + ' string of at most ' + max + ' characters.');
  return value.trim();
}
function readCuratedInput(inputPath) {
  const stat = fs.statSync(inputPath);
  if (stat.size > MAX_INPUT_BYTES || path.extname(inputPath).toLowerCase() !== '.json') fail('Input must be a JSON file no larger than 2 MiB.');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8').replace(/^\uFEFF/, ''));
  if (!Array.isArray(data) || !data.length || data.length > 500) fail('Input must be an explicit array of 1 to 500 curated records.');
  const ids = new Set();
  return data.map(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) fail('Each input item must be a record object.');
    if (Object.keys(item).some(key => !['id', 'title', 'content', 'source'].includes(key))) fail('Only id, title, content, and source are accepted; raw chat/history formats are unsupported.');
    const id = stringField(item, 'id', 120);
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/.test(id) || ids.has(id)) fail('Record IDs must be unique simple identifiers.');
    ids.add(id);
    return { id, title: stringField(item, 'title', 240), content: stringField(item, 'content', 16000), source: stringField(item, 'source', 2000) };
  });
}
function openOfficialStore(filename) {
  const store = new VectorStore(filename, 0, logger);
  store.init();
  if (store.isDegraded() || !store.isFtsAvailable()) { store.close(); fail('TencentDB SQLite FTS5 initialization failed.'); }
  return store;
}
function parseMetadata(text) { try { const value = JSON.parse(text || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } }
function recordFromRow(row) {
  return {
    id: row.record_id, content: row.content, type: row.type, priority: row.priority,
    scene_name: row.scene_name || '', source_message_ids: [], metadata: parseMetadata(row.metadata_json),
    timestamps: row.timestamp_str ? [row.timestamp_str] : [], createdAt: row.created_time, updatedAt: row.updated_time,
    version: row.version || 1, sessionKey: row.session_key || 'curated-project-requirements',
    sessionId: row.session_id || 'explicit-curation', teamId: row.team_id, agentId: row.agent_id, userId: row.user_id, taskId: row.task_id,
  };
}
function readExistingRows(dbPath) {
  if (!fs.existsSync(dbPath)) fail('Database does not exist. Explicit ingest is required; search/check never create a database.');
  const db = new DatabaseSync(dbPath, { readOnly: true });
  try {
    db.exec('PRAGMA query_only = ON');
    const present = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='l1_records'").get();
    if (!present) fail('Database is not a TencentDB memory store.');
    return db.prepare('SELECT * FROM l1_records WHERE team_id=? AND agent_id=? AND user_id=? AND task_id=? ORDER BY record_id').all(SCOPE.teamId, SCOPE.agentId, SCOPE.userId, SCOPE.taskId);
  } finally { db.close(); }
}
function ingest(dbPath, records) {
  const store = openOfficialStore(dbPath);
  try {
    const now = new Date().toISOString();
    const matched = store.queryL1Records({ recordIds: records.map(item => item.id) });
    for (const row of matched) {
      if (row.team_id !== SCOPE.teamId || row.agent_id !== SCOPE.agentId || row.user_id !== SCOPE.userId || row.task_id !== SCOPE.taskId) fail('Record ID already belongs to a different scope: ' + row.record_id);
    }
    const existing = new Map(matched.map(row => [row.record_id, row]));
    const written = [];
    for (const item of records) {
      const old = existing.get(item.id);
      const oldMetadata = old ? parseMetadata(old.metadata_json) : {};
      if (old && old.content === item.title + '\n' + item.content && oldMetadata.source === item.source) continue;
      const record = {
        id: item.id, content: item.title + '\n' + item.content, type: 'instruction', priority: 90,
        scene_name: 'Explicit project requirements', source_message_ids: [],
        metadata: { title: item.title, source: item.source, curated: true }, timestamps: [now],
        createdAt: old?.created_time || now, updatedAt: now, version: (old?.version || 0) + 1,
        sessionKey: 'curated-project-requirements', sessionId: 'explicit-curation', ...SCOPE,
      };
      if (!store.upsertL1(record, undefined)) fail('TencentDB rejected record: ' + item.id);
      written.push(item.id);
    }
    return { backend: 'TencentDB VectorStore', sourceCommit: SOURCE_COMMIT, mode: 'SQLite FTS5 / BM25; no LLM', inputRecords: records.length, written: written.length, unchanged: records.length - written.length, recordCount: store.countL1(SCOPE), idsWritten: written };
  } finally { store.close(); }
}
function readOrSearch(command, dbPath, query, limit) {
  const rows = readExistingRows(dbPath);
  // Original upstream constructor/init writes schema. Hydrate an ephemeral store
  // so all search scoring is upstream code while the persisted DB stays read-only.
  const store = openOfficialStore(':memory:');
  try {
    for (const row of rows) if (!store.upsertL1(recordFromRow(row), undefined)) fail('Unable to hydrate memory record.');
    const result = { backend: 'TencentDB VectorStore', sourceCommit: SOURCE_COMMIT, mode: 'SQLite FTS5 / BM25; no LLM', readOnly: true, fts5: store.isFtsAvailable(), degraded: store.isDegraded(), embeddingDimensions: store.getEmbeddingDimensions(), recordCount: rows.length };
    if (command === 'search') {
      if (typeof query !== 'string' || !query.trim() || query.length > 2048) fail('Search query must contain 1 to 2048 characters.');
      const ftsQuery = buildFtsQuery(query);
      result.items = ftsQuery ? store.searchL1Fts(ftsQuery, limit, SCOPE).map(hit => {
        const meta = parseMetadata(hit.metadata_json);
        return { id: hit.record_id, title: meta.title || '', content: hit.content, source: meta.source || '', score: hit.score, version: hit.version };
      }) : [];
    }
    return result;
  } finally { store.close(); }
}
try {
  const { command, options } = parseArgs(process.argv.slice(2));
  const dbPath = absoluteFile(options['--db'], 'Database', true);
  let result;
  if (command === 'ingest') {
    const inputPath = absoluteFile(options['--input'], 'Input');
    if (!fs.existsSync(inputPath)) fail('Input file does not exist.');
    result = ingest(dbPath, readCuratedInput(inputPath));
  } else {
    const limit = Number(options['--limit'] || 5);
    if (!Number.isInteger(limit) || limit < 1 || limit > 20) fail('Limit must be an integer from 1 to 20.');
    result = readOrSearch(command, dbPath, options['--query'], limit);
  }
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(JSON.stringify({ error: error.message }));
  process.exitCode = 2;
}