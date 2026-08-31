
# Event Schema

Events are immutable envelopes with explicit versioning and delivery metadata. They are written to D1 before being fanned out to Queues so operators can inspect or replay them.

```ts
export type DataClassification = 'public' | 'internal' | 'restricted' | 'confidential';

export interface EventEnvelope<TName extends string = string, TPayload extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  name: TName; // e.g. knowledge-base.article.published.v1
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
  actor?: {
    type: 'user' | 'system' | 'module';
    id: string;
  };
  payload: TPayload;
  retry?: {
    count: number;
    max: number;
    nextAttemptAt?: string;
  };
}
```

## Naming

- Use `<domain>.<entity>.<action>.v<major>`.
- Major changes create a new event name version, not an in-place shape mutation.
- Minor additive payload changes are allowed if consumers ignore unknown fields.

## Retry and idempotency

- `idempotencyKey` is stable across retries.
- Consumers store processed keys keyed by consumer name and installation.
- Queue retries increment `retry.count`; dead-letter handling is triggered when `count > max`.

## Loop prevention

- `loopGuard` captures the publishers that have already handled the event.
- `hopCount` limits cascading fan-out.
- Module subscribers must reject events if their module key already exists in `loopGuard`.
