
import type { AuditCategory, AuditEntry } from '@community-os/core-types';

import type { D1Database } from '../types';

export class AuditService {
  public constructor(private readonly db: D1Database, private readonly installationId: string) {}

  public async write(entry: Omit<AuditEntry, 'id' | 'installationId' | 'occurredAt'> & { occurredAt?: string }): Promise<AuditEntry> {
    const persisted: AuditEntry = {
      id: crypto.randomUUID(),
      installationId: this.installationId,
      occurredAt: entry.occurredAt ?? new Date().toISOString(),
      ...entry,
    };

    await this.db
      .prepare(
        `INSERT INTO audit_log (id, installation_id, actor_id, category, action, target_type, target_id, outcome, message, metadata_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        persisted.id,
        persisted.installationId,
        persisted.actorId ?? null,
        persisted.category,
        persisted.action,
        persisted.targetType,
        persisted.targetId ?? null,
        persisted.outcome,
        persisted.message,
        JSON.stringify(persisted.metadata),
        persisted.occurredAt,
      )
      .run();

    return persisted;
  }

  public static categoryForRoute(route: string): AuditCategory {
    if (route.includes('/auth')) {
      return 'auth';
    }
    if (route.includes('/modules')) {
      return 'module';
    }
    return 'system';
  }
}
