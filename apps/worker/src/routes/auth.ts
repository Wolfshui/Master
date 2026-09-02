/* eslint-disable */

import { deleteCookie, setCookie } from 'hono/cookie';
import { Hono } from 'hono';
import type { Context } from 'hono';

import type { AppEnv } from '../index';
import { requireAuth } from '../middleware/auth';
import { AuditService } from '../services/audit';
import { EventBus } from '../services/event-bus';
import { IdentityService } from '../services/identity';

const authRoutes = new Hono<AppEnv>();

function installationId(c: Context<AppEnv>): string {
  return c.env.INSTALLATION_ID ?? 'default-installation';
}

authRoutes.post('/setup', async (c) => {
  const body = await c.req.json<{ email: string; password: string; displayName: string }>();
  const identity = new IdentityService(c.env.DB);
  const audit = new AuditService(c.env.DB, installationId(c));

  try {
    const user = await identity.bootstrapOwner({
      installationId: installationId(c),
      email: body.email,
      password: body.password,
      displayName: body.displayName,
    });

    await audit.write({
      actorId: user.id,
      category: 'identity',
      action: 'owner.bootstrap',
      targetType: 'user',
      targetId: user.id,
      outcome: 'success',
      message: 'Initial owner account created.',
      metadata: { email: user.email },
    });

    return c.json({ user }, 201);
  } catch (error) {
    await audit.write({
      category: 'identity',
      action: 'owner.bootstrap',
      targetType: 'installation',
      outcome: 'failure',
      message: error instanceof Error ? error.message : 'Setup failed.',
      metadata: {},
    });

    return c.json({ error: error instanceof Error ? error.message : 'Setup failed.' }, 400);
  }
});

authRoutes.post('/login', async (c) => {
  const body = await c.req.json<{ email: string; password: string }>();
  const identity = new IdentityService(c.env.DB);
  const audit = new AuditService(c.env.DB, installationId(c));
//   const events = new EventBus(c.env.DB, c.env.EVENT_QUEUE);
  const loginInput = {
    installationId: installationId(c),
    email: body.email,
    password: body.password,
    ...(c.req.header('CF-Connecting-IP') ? { ipAddress: c.req.header('CF-Connecting-IP') as string } : {}),
    ...(c.req.header('User-Agent') ? { userAgent: c.req.header('User-Agent') as string } : {}),
  };
  const auth = await identity.authenticate({
    ...loginInput,
  });

  if (!auth) {
    await audit.write({
      category: 'auth',
      action: 'session.login',
      targetType: 'user',
      outcome: 'failure',
      message: 'Login failed.',
      metadata: { email: body.email.toLowerCase() },
    });

    return c.json({ error: 'Invalid credentials.' }, 401);
  }

  await audit.write({
    actorId: auth.user.id,
    category: 'auth',
    action: 'session.login',
    targetType: 'session',
    targetId: auth.sessionId,
    outcome: 'success',
    message: 'Session created.',
    metadata: { email: auth.user.email },
  });

  await events.publish({
    id: crypto.randomUUID(),
    name: 'identity.session.created.v1',
    version: 1,
    installationId: auth.user.installationId,
    source: 'worker.auth',
    subject: `session:${auth.sessionId}`,
    occurredAt: new Date().toISOString(),
    traceId: crypto.randomUUID(),
    idempotencyKey: auth.sessionId,
    loopGuard: ['worker.auth'],
    dataClassification: 'restricted',
    actor: { id: auth.user.id },
    payload: { sessionId: auth.sessionId, userId: auth.user.id },
  } as any);

  const cookieName = c.env.SESSION_COOKIE_NAME ?? 'community_os_session';
  setCookie(c, cookieName, auth.sessionToken, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: true,
    path: '/',
    expires: new Date(auth.expiresAt),
  });

  return c.json({ user: auth.user, sessionId: auth.sessionId });
});

authRoutes.get('/session', requireAuth, (c) => {
  const auth = c.get('auth');
  return c.json({ user: auth?.user ?? null, sessionId: auth?.sessionId ?? null });
});

authRoutes.post('/logout', requireAuth, async (c) => {
  const cookieName = c.env.SESSION_COOKIE_NAME ?? 'community_os_session';
  const auth = c.get('auth');
  if (auth) {
    const identity = new IdentityService(c.env.DB);
    const audit = new AuditService(c.env.DB, installationId(c));

    await identity.invalidateSession(auth.sessionToken);
    await audit.write({
      actorId: auth.user.id,
      category: 'auth',
      action: 'session.logout',
      targetType: 'session',
      targetId: auth.sessionId,
      outcome: 'success',
      message: 'Session revoked.',
      metadata: {},
    });
  }

  deleteCookie(c, cookieName, { path: '/' });
  return c.json({ success: true });
});

export { authRoutes };
