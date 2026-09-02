
import type { EventEnvelope, EventService, QueueService } from '@community-os/core-types';
import { validateEventEnvelope } from '@community-os/core-types';

import type { D1Database, QueueBinding } from '../types';

export class EventBus implements EventService, QueueService<EventEnvelope> {
  public constructor(
    private readonly db: D1Database,
    private readonly queue: QueueBinding<Record<string, unknown>>,
  ) {}

  public async publish<TPayload extends Record<string, unknown>>(event: EventEnvelope<string, TPayload>): Promise<void> {
    const validation = validateEventEnvelope(event);
    if (!validation.valid) {
      throw new Error(validation.errors.join(' '));
    }

    await this.db
      .prepare(
        `INSERT INTO events (id, installation_id, name, version, aggregate_type, aggregate_id, actor_id, classification, payload_json, idempotency_key, trace_id, source, occurred_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        event.id,
        event.installationId,
        event.name,
        event.version,
        event.subject.split(':')[0] ?? 'event',
        event.subject,
        event.actor?.id ?? null,
        event.dataClassification,
        JSON.stringify(event.payload),
        event.idempotencyKey,
        event.traceId,
        event.source,
        event.occurredAt,
      )
      .run();

    await this.queue.send(event as unknown as Record<string, unknown>);
  }

  public async publishBatch(events: readonly EventEnvelope[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  public async send(message: EventEnvelope): Promise<void> {
    await this.queue.send(message as unknown as Record<string, unknown>);
  }

  public async sendBatch(messages: readonly EventEnvelope[]): Promise<void> {
    await this.queue.sendBatch(messages as unknown as readonly Record<string, unknown>[]);
  }
}
