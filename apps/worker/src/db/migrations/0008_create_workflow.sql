
CREATE TABLE IF NOT EXISTS workflow_definitions (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  key TEXT NOT NULL,
  version INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (installation_id, key, version)
);
CREATE TABLE IF NOT EXISTS workflow_states (
  id TEXT PRIMARY KEY,
  definition_id TEXT NOT NULL,
  key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_initial INTEGER NOT NULL DEFAULT 0,
  is_terminal INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (definition_id) REFERENCES workflow_definitions(id)
);
CREATE TABLE IF NOT EXISTS workflow_transitions (
  id TEXT PRIMARY KEY,
  definition_id TEXT NOT NULL,
  from_state_key TEXT NOT NULL,
  to_state_key TEXT NOT NULL,
  event_name TEXT NOT NULL,
  permission_key TEXT,
  condition_expression TEXT,
  FOREIGN KEY (definition_id) REFERENCES workflow_definitions(id)
);
CREATE TABLE IF NOT EXISTS workflow_instances (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  definition_id TEXT NOT NULL,
  current_state_key TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  context_json TEXT NOT NULL,
  started_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (definition_id) REFERENCES workflow_definitions(id)
);
