
import { Hono } from 'hono';

import { createKnowledgeBaseRoutes } from '@community-os/module-knowledge-base';

import { sessionAuth } from './middleware/auth';
import { corsMiddleware } from './middleware/cors';
import { authRoutes } from './routes/auth';
import { healthRoutes } from './routes/health';
import { moduleRoutes } from './routes/modules';
import type { AppVariables, EnvBindings } from './types';

export type AppEnv = {
  Bindings: EnvBindings;
  Variables: AppVariables;
};

export const app = new Hono<AppEnv>();

app.use('*', corsMiddleware);
app.use('*', sessionAuth);
app.route('/api/v1/health', healthRoutes);
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/modules', moduleRoutes);
app.route('/api/v1', createKnowledgeBaseRoutes<AppEnv>());

export default app;
