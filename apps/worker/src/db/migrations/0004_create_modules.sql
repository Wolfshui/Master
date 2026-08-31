
CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT NOT NULL,
  manifest_json TEXT NOT NULL,
  installed_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  activated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_modules_installation_status ON modules (installation_id, status);
