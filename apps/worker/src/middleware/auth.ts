/* eslint-disable */

import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import type { AppEnv } from '../index';
import { IdentityService } from '../services/identity';

export const sessionAuth = createMiddleware<AppEnv>(async (c, next) => {
  const cookieName = c.env.SESSION_COOKIE_NAME ?? 'community_os_session';
  const sessionToken = getCookie(c, cookieName);
  c.set('auth', null);

  if (sessionToken) {
    const identityService = new IdentityService(c.env.DB);
    const auth = await identityService.getSession(sessionToken);
    if (auth) {
      c.set('auth', auth);
    }
  }

  await next();
});

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  if (!c.get('auth')) {
    return c.json({ error: 'Authentication required.' }, 401);
  }

  await next();
});

export const requireOwner = createMiddleware<AppEnv>(async (c, next) => {
  const auth = c.get('auth');
  if (!auth) {
    return c.json({ error: 'Authentication required.' }, 401);
  }

  if (!auth.user.isOwner) {
    return c.json({ error: 'Owner privileges are required.' }, 403);
  }

  await next();
});
