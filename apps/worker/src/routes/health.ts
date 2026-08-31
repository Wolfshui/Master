
import { Hono } from 'hono';

import type { AppEnv } from '../index';

export const healthRoutes = new Hono<AppEnv>();

healthRoutes.get('/', (c) => {
  return c.json({
    status: 'ok',
    service: 'community-platform-os-worker',
    timestamp: new Date().toISOString(),
  });
});
