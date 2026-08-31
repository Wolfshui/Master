
export type DataClassification = 'public' | 'internal' | 'restricted' | 'confidential';

export const CORE_EVENT_NAMES = {
  USER_CREATED: 'identity.user.created.v1',
  SESSION_CREATED: 'identity.session.created.v1',
  SESSION_REVOKED: 'identity.session.revoked.v1',
  MODULE_INSTALLED: 'module.installed.v1',
  MODULE_ACTIVATED: 'module.activated.v1',
  FORM_SUBMITTED: 'forms.submission.created.v1',
  WORKFLOW_TRANSITIONED: 'workflow.instance.transitioned.v1',
  CONTENT_PUBLISHED: 'content.item.published.v1',
  KB_ARTICLE_PUBLISHED: 'knowledge-base.article.published.v1',
} as const;

export type CoreEventNames = (typeof CORE_EVENT_NAMES)[keyof typeof CORE_EVENT_NAMES];

export interface EventActor {
  type: 'user' | 'system' | 'module';
  id: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface EventEnvelope<
  TName extends string = string,
  TPayload extends Record<string, unknown> = Record<string, unknown>,
> {
  id: string;
  name: TName;
  version: number;
  installationId: string;
  source: string;
  subject: string;
  occurredAt: string;
  traceId: string;
  idempotencyKey: string;
  correlationId?: string;
  causationId?: string;
  hopCount?: number;
  loopGuard: readonly string[];
  dataClassification: DataClassification;
  actor?: EventActor;
  payload: TPayload;
  retry?: {
    count: number;
    max: number;
    nextAttemptAt?: string;
  };
}

export interface EventValidationResult {
  valid: boolean;
  errors: readonly string[];
}

const versionedEventPattern = /^[a-z0-9.-]+\.v[0-9]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIsoDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export function validateEventEnvelope(candidate: unknown): EventValidationResult {
  const errors: string[] = [];

  if (!isRecord(candidate)) {
    return { valid: false, errors: ['Event envelope must be an object.'] };
  }

  const requiredStrings = ['id', 'name', 'installationId', 'source', 'subject', 'occurredAt', 'traceId', 'idempotencyKey'];
  for (const key of requiredStrings) {
    if (typeof candidate[key] !== 'string' || candidate[key].trim().length === 0) {
      errors.push(`Expected ${key} to be a non-empty string.`);
    }
  }

  if (typeof candidate.version !== 'number' || !Number.isInteger(candidate.version) || candidate.version < 1) {
    errors.push('Expected version to be a positive integer.');
  }

  if (typeof candidate.name === 'string' && !versionedEventPattern.test(candidate.name)) {
    errors.push('Event name must include a version suffix like .v1.');
  }

  if (typeof candidate.occurredAt === 'string' && !isIsoDate(candidate.occurredAt)) {
    errors.push('occurredAt must be an ISO-8601 timestamp.');
  }

  if (!Array.isArray(candidate.loopGuard) || candidate.loopGuard.some((value) => typeof value !== 'string')) {
    errors.push('loopGuard must be an array of strings.');
  }

  if (!isRecord(candidate.payload)) {
    errors.push('payload must be an object.');
  }

  const classifications: readonly DataClassification[] = ['public', 'internal', 'restricted', 'confidential'];
  if (!classifications.includes(candidate.dataClassification as DataClassification)) {
    errors.push('dataClassification must be one of public, internal, restricted, or confidential.');
  }

  if (candidate.actor !== undefined && !isRecord(candidate.actor)) {
    errors.push('actor must be an object when provided.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function assertEventEnvelope(candidate: unknown): asserts candidate is EventEnvelope {
  const result = validateEventEnvelope(candidate);
  if (!result.valid) {
    throw new Error(result.errors.join(' '));
  }
}
