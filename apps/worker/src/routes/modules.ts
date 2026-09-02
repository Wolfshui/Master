/* eslint-disable */

import { Hono } from 'hono';
import type { Context } from 'hono';

import type { ModuleManifest } from '@community-os/core-types';
import { ManifestValidator } from '@community-os/module-sdk';

import type { AppEnv } from '../index';
import { requireOwner } from '../middleware/auth';
import { AuditService } from '../services/audit';
import { EventBus } from '../services/event-bus';

export const moduleRoutes = new Hono<AppEnv>();

function installationId(c: Context<AppEnv>): string {
  return c.env.INSTALLATION_ID ?? 'default-installation';
}

moduleRoutes.get('/', async (c) => {
  const rows = await c.env.DB
    .prepare('SELECT id, installation_id, name, version, status, manifest_json, installed_at, updated_at FROM modules ORDER BY name ASC')
    .all<{
      id: string;
      installation_id: string;
      name: string;
      version: string;
      status: string;
      manifest_json: string;
      installed_at: string;
      updated_at: string;
    }>();

  const modules = rows.results.map((row) => ({
    id: row.id,
    installationId: row.installation_id,
    name: row.name,
    version: row.version,
    status: row.status,
    manifest: JSON.parse(row.manifest_json) as ModuleManifest,
    installedAt: row.installed_at,
    updatedAt: row.updated_at,
  }));

  return c.json({ modules });
});

moduleRoutes.post('/install', requireOwner, async (c) => {
  const body = await c.req.json<{ manifest: ModuleManifest }>();
  const validator = new ManifestValidator();
  const result = validator.validate(body.manifest);
  if (!result.valid || !result.manifest) {
    return c.json({ error: 'Invalid module manifest.', details: result.errors }, 400);
  }

  const manifest = result.manifest;
  const now = new Date().toISOString();
  await c.env.DB
    .prepare(
      `INSERT INTO modules (id, installation_id, name, version, status, manifest_json, installed_at, updated_at, activated_at)
       VALUES (?, ?, ?, ?, 'installed', ?, ?, ?, NULL)
       ON CONFLICT(id) DO UPDATE SET version = excluded.version, status = 'installed', manifest_json = excluded.manifest_json, updated_at = excluded.updated_at`,
    )
    .bind(manifest.id, installationId(c), manifest.name, manifest.version, JSON.stringify(manifest), now, now)
    .run();

  const auth = c.get('auth');
  const audit = new AuditService(c.env.DB, installationId(c));
  await audit.write({
    ...(auth ? { actorId: auth.user.id } : {}),
    category: 'module',
    action: 'module.install',
    targetType: 'module',
    targetId: manifest.id as string,
    outcome: 'success',
    message: `Installed module ${manifest.name}.`,
    metadata: { version: manifest.version },
  });

//   const events = new EventBus(c.env.DB, c.env.EVENT_QUEUE);
  await events.publish({
    id: crypto.randomUUID(),
    name: 'module.installed.v1',
    version: 1,
    installationId: installationId(c),
    source: 'worker.modules',
    subject: `module:${manifest.id}`,
    occurredAt: now,
    traceId: crypto.randomUUID(),
    idempotencyKey: `${manifest.id}:${manifest.version}`,
    loopGuard: ['worker.modules'],
    dataClassification: 'internal',
    ...(auth ? { actor: { id: auth.user.id } } : {}),
    payload: { moduleId: manifest.id as string, version: manifest.version as string },
  });

  return c.json({ module: manifest }, 201);
});
