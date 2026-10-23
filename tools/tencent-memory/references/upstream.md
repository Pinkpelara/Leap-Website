# Upstream provenance and capability

Source: https://github.com/TencentCloud/TencentDB-Agent-Memory
Pinned commit: 0468a2a5b50eaafc54758ed1e2e6609472e5b6ce
Inspected: 2026-09-11
License: MIT, preserved with the vendored source.

The full repository implements Chat Memory, Skills, Wiki and CodeGraph, a management hub, and optional agent traffic proxy integrations. Its existing MemoryCore/SKILL.md targets OpenClaw; it is not a drop-in Codex design skill.

This skill uses a narrower real upstream feature:

- MemoryCore/src/core/store/sqlite/memory-store.ts: VectorStore with dimensions=0. In this mode SQLite stores metadata and FTS text without loading sqlite-vec or calling a language model.
- MemoryCore/src/core/store/tokenize.ts: upstream tokenization and FTS query building. The optional jieba dependency falls back to a Unicode tokenizer when absent.
- Upstream isolation, type and table-DDL modules are included as necessary to preserve the store's schema and query behavior.

The local CLI manually stores only explicit records and uses upstream FTS/BM25 retrieval. It does not perform semantic vector search, LLM extraction, chat profiling, automatic capture, cloud synchronization, team sharing or Memory Hub deployment.

Do not run the repository's global Codex proxy setup as a side effect of using this skill. That is a separate configuration change involving conversation routing and retention.

Inspect vendor-source.json for exact files and hashes. The vendored JavaScript is transpiled from the pinned TypeScript source; preserve the original source files and license when updating it. Validate an update with real synthetic ingest/retrieval before using project records.
