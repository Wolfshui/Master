
CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  type TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  locale TEXT NOT NULL,
  translation_group_id TEXT,
  status TEXT NOT NULL,
  latest_revision_number INTEGER NOT NULL DEFAULT 0,
  workflow_instance_id TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (installation_id, slug, locale)
);
CREATE TABLE IF NOT EXISTS content_revisions (
  id TEXT PRIMARY KEY,
  content_item_id TEXT NOT NULL,
  revision_number INTEGER NOT NULL,
  summary TEXT,
  body_json TEXT NOT NULL,
  checksum TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  published_at TEXT,
  UNIQUE (content_item_id, revision_number),
  FOREIGN KEY (content_item_id) REFERENCES content_items(id)
);
