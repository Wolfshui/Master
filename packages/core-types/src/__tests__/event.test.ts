
import { describe, expect, it } from 'vitest';

import { CORE_EVENT_NAMES, validateEventEnvelope } from '../event';

describe('validateEventEnvelope', () => {
  it('accepts a well-formed event envelope', () => {
    const result = validateEventEnvelope({
      id: 'evt_1',
      name: CORE_EVENT_NAMES.KB_ARTICLE_PUBLISHED,
      version: 1,
      installationId: 'inst_1',
      source: 'knowledge-base',
      subject: 'kb_article:article_1',
      occurredAt: '2026-08-31T00:00:00.000Z',
      traceId: 'trace_1',
      idempotencyKey: 'idem_1',
      loopGuard: ['knowledge-base'],
      dataClassification: 'internal',
      payload: {
        articleId: 'article_1',
      },
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects events without versioned names', () => {
    const result = validateEventEnvelope({
      id: 'evt_2',
      name: 'knowledge-base.article.published',
      version: 1,
      installationId: 'inst_1',
      source: 'knowledge-base',
      subject: 'kb_article:article_1',
      occurredAt: '2026-08-31T00:00:00.000Z',
      traceId: 'trace_1',
      idempotencyKey: 'idem_2',
      loopGuard: ['knowledge-base'],
      dataClassification: 'internal',
      payload: {},
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Event name must include a version suffix like .v1.');
  });
});
