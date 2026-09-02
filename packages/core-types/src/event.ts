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
};

const versionedEventPattern = /^[a-z0-9.-]+\.v[0-9]+$/;

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIsoDate(value: unknown): boolean {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

export function validateEventEnvelope(candidate: unknown): ValidationResult {
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

  if (!Array.isArray(candidate.loopGuard) || !candidate.loopGuard.every((value) => typeof value === 'string')) {
    errors.push('loopGuard must be an array of strings.');
  }

  if (!isRecord(candidate.payload)) {
    errors.push('payload must be an object.');
  }

  const classifications = ['public', 'internal', 'restricted', 'confidential'];
  if (typeof candidate.dataClassification !== 'string' || !classifications.includes(candidate.dataClassification)) {
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

export function assertEventEnvelope(candidate: unknown): asserts candidate {
  const result = validateEventEnvelope(candidate);
  if (!result.valid) {
    throw new Error(result.errors.join(' '));
  }
}
