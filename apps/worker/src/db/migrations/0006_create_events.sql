
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  name TEXT NOT NULL,
  version INTEGER NOT NULL,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  actor_id TEXT,
  classification TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  trace_id TEXT NOT NULL,
  source TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  processed_at TEXT,
  UNIQUE (installation_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS idx_events_installation_name ON events (installation_id, name, occurred_at DESC);
