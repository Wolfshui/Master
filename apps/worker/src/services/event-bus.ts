/* eslint-disable */

import type { D1Database } from '../types';

export class EventBus {
  public constructor(
    private readonly db: D1Database,
  ) {}

  public async publish(event: Record<string, unknown>): Promise<void> {
    // Store event in database
    // Queue support will be added back later
  }
}
