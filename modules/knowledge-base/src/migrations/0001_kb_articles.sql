
CREATE TABLE IF NOT EXISTS kb_articles (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  content_item_id TEXT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'draft',
  discoverable INTEGER NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (installation_id, slug, locale)
);
