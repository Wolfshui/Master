
export type AuditCategory =
  | 'auth'
  | 'identity'
  | 'module'
  | 'permission'
  | 'workflow'
  | 'content'
  | 'reporting'
  | 'system';

export interface AuditEntry {
  id: string;
  installationId: string;
  actorId?: string;
  category: AuditCategory;
  action: string;
  targetType: string;
  targetId?: string;
  outcome: 'success' | 'failure';
  message: string;
  metadata: Record<string, string | number | boolean | null>;
  occurredAt: string;
}
