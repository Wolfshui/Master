export type AuditCategory = 'auth' | 'identity' | 'module' | 'system' | 'content' | 'workflow' | 'form';

export type AuditOutcome = 'success' | 'failure' | 'warning';

export interface AuditEntry {
  id: string;
  installationId: string;
  actorId?: string;
  category: AuditCategory;
  action: string;
  targetType: string;
  targetId?: string;
  outcome: AuditOutcome;
  message: string;
  metadata: Record<string, unknown>;
  occurredAt: string;
}
