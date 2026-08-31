
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Miniflare } from 'miniflare';

import { app } from '../index';
import type { D1Database, EnvBindings, KVNamespace, QueueBinding, R2Bucket } from '../types';

const schema = `
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  is_owner INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (installation_id, email)
);
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  installation_id TEXT NOT NULL,
  session_token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  installation_id TEXT NOT NULL,
  actor_id TEXT,
  category TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  outcome TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE modules (
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
CREATE TABLE events (
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
CREATE TABLE kb_articles (
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
`;

function createQueueStub(): QueueBinding<Record<string, unknown>> {
  return {
    send(): Promise<void> {
      return Promise.resolve();
    },
    sendBatch(): Promise<void> {
      return Promise.resolve();
    },
  };
}

function createBucketStub(): R2Bucket {
  return {
    put(): Promise<void> {
      return Promise.resolve();
    },
    get(): Promise<null> {
      return Promise.resolve(null);
    },
    delete(): Promise<void> {
      return Promise.resolve();
    },
  };
}

function createKvStub(): KVNamespace {
  const data = new Map<string, string>();
  return {
    get(key: string): Promise<string | null> {
      return Promise.resolve(data.get(key) ?? null);
    },
    put(key: string, value: string): Promise<void> {
      data.set(key, value);
      return Promise.resolve();
    },
    delete(key: string): Promise<void> {
      data.delete(key);
      return Promise.resolve();
    },
  };
}

describe('auth routes', () => {
  let miniflare: Miniflare;
  let env: EnvBindings;

  beforeEach(async () => {
    miniflare = new Miniflare({
      modules: true,
      script: 'export default { async fetch() { return new Response("ok"); } }',
      compatibilityDate: '2026-08-31',
      d1Databases: { DB: 'test-db' },
    });

    const db = (await miniflare.getD1Database('DB')) as unknown as D1Database;
    for (const statement of schema
      .split(';')
      .map((value) => value.trim())
      .filter((value) => value.length > 0)) {
      await db.prepare(statement).run();
    }

    env = {
      DB: db,
      MODULE_ASSETS: createBucketStub(),
      PLATFORM_CACHE: createKvStub(),
      EVENT_QUEUE: createQueueStub(),
      INSTALLATION_ID: 'test-installation',
      SESSION_COOKIE_NAME: 'community_os_session',
    };
  });

  afterEach(async () => {
    await miniflare.dispose();
  });

  it('bootstraps the first owner and returns an authenticated session', async () => {
    const setupResponse = await app.fetch(
      new Request('http://localhost/api/v1/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'owner@example.com',
          password: 'super-secret-password',
          displayName: 'Owner',
        }),
      }),
      env,
    );

    expect(setupResponse.status).toBe(201);

    const loginResponse = await app.fetch(
      new Request('http://localhost/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'owner@example.com',
          password: 'super-secret-password',
        }),
      }),
      env,
    );

    expect(loginResponse.status).toBe(200);
    const cookie = loginResponse.headers.get('set-cookie');
    expect(cookie).toContain('community_os_session=');

    const sessionResponse = await app.fetch(
      new Request('http://localhost/api/v1/auth/session', {
        headers: {
          Cookie: cookie ?? '',
        },
      }),
      env,
    );

    expect(sessionResponse.status).toBe(200);
    const sessionBody = (await sessionResponse.json()) as { user: { email: string } };
    expect(sessionBody.user.email).toBe('owner@example.com');
  });
});
