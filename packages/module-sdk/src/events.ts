
import type { EventEnvelope } from '@community-os/core-types';

export interface EventPublisher {
  publish<TPayload extends Record<string, unknown>>(event: EventEnvelope<string, TPayload>): Promise<void>;
}

export interface EventSubscriber {
  readonly name: string;
  readonly subscribedEvents: readonly string[];
  handle(event: EventEnvelope): Promise<void>;
}
