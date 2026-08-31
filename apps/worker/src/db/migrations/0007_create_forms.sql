
CREATE TABLE IF NOT EXISTS forms (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  key TEXT NOT NULL,
  version INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  submit_permission TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (installation_id, key, version)
);
CREATE TABLE IF NOT EXISTS form_fields (
  id TEXT PRIMARY KEY,
  form_id TEXT NOT NULL,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL,
  required INTEGER NOT NULL DEFAULT 0,
  placeholder TEXT,
  hint TEXT,
  options_json TEXT,
  validation_json TEXT,
  FOREIGN KEY (form_id) REFERENCES forms(id)
);
CREATE TABLE IF NOT EXISTS form_submissions (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  form_id TEXT NOT NULL,
  submitted_by TEXT,
  workflow_instance_id TEXT,
  payload_json TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  FOREIGN KEY (form_id) REFERENCES forms(id)
);
