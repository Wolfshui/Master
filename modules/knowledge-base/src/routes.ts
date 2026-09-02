/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

import type { Context } from 'hono';
import { Hono } from 'hono';
import type { AuthenticatedSession } from '@community-os/core-types';
import { knowledgeBaseEventNames } from './events';
import { ArticleService } from './services/article.service';

interface KnowledgeBaseContext {
  Variables: {
    auth: AuthenticatedSession | null;
  };
}

export function createKnowledgeBaseRoutes<E extends { Variables: KnowledgeBaseContext['Variables'] } = { Variables: KnowledgeBaseContext['Variables'] }>() {
  const knowledgeBaseRoutes = new Hono<E>();

  knowledgeBaseRoutes.get('/kb/articles', async (c: Context<E>) => {
    const auth = c.get('auth');
    if (!auth) {
      return c.json({ error: 'Authentication required.' }, 401);
    }
    const db = (c.env as any).DB;
    const installationId = (c.env as any).INSTALLATION_ID ?? 'default-installation';
    const articles = await new ArticleService(db, installationId).list();
    return c.json({ articles });
  });
  
  knowledgeBaseRoutes.get('/kb/articles/:id', async (c: Context<E>) => {
    const auth = c.get('auth');
    if (!auth) {
      return c.json({ error: 'Authentication required.' }, 401);
    }
    const db = (c.env as any).DB;
    const installationId = (c.env as any).INSTALLATION_ID ?? 'default-installation';
    const article = await new ArticleService(db, installationId).getById(c.req.param('id'));
    if (!article) {
      return c.json({ error: 'Article not found.' }, 404);
    }
    return c.json({ article });
  });
  
  knowledgeBaseRoutes.post('/kb/articles', async (c: Context<E>) => {
    const auth = c.get('auth');
    if (!auth) {
      return c.json({ error: 'Authentication required.' }, 401);
    }
    const body = (await c.req.json()) as Record<string, unknown>;
    const db = (c.env as any).DB;
    const installationId = (c.env as any).INSTALLATION_ID ?? 'default-installation';
    const articleService = new ArticleService(db, installationId);
    const article = await articleService.create({
      title: String(body.title || ''),
      slug: String(body.slug || ''),
      summary: String(body.summary || ''),
      category: String(body.category || ''),
      bodyMarkdown: String(body.bodyMarkdown || ''),
      locale: String(body.locale || 'en'),
      status: String(body.status || 'draft'),
      discoverable: Boolean(body.discoverable !== false),
      createdBy: (auth as any).user.id,
      updatedBy: (auth as any).user.id,
    });
    const eventQueue = (c.env as any).EVENT_QUEUE;
    await eventQueue.send({
      eventName: knowledgeBaseEventNames.articleCreated,
      articleId: article.id,
      installationId: article.installationId,
    });
    return c.json({ article }, 201);
  });
  
  knowledgeBaseRoutes.put('/kb/articles/:id', async (c: Context<E>) => {
    const auth = c.get('auth');
    if (!auth) {
      return c.json({ error: 'Authentication required.' }, 401);
    }
    const db = (c.env as any).DB;
    const installationId = (c.env as any).INSTALLATION_ID ?? 'default-installation';
    const articleService = new ArticleService(db, installationId);
    const body = (await c.req.json()) as Record<string, unknown>;
    const updateInput: Record<string, unknown> = {};
    if (body.title !== undefined) updateInput.title = body.title;
    if (body.slug !== undefined) updateInput.slug = body.slug;
    if (body.summary !== undefined) updateInput.summary = body.summary;
    if (body.category !== undefined) updateInput.category = body.category;
    if (body.bodyMarkdown !== undefined) updateInput.bodyMarkdown = body.bodyMarkdown;
    if (body.locale !== undefined) updateInput.locale = body.locale;
    if (body.status !== undefined) updateInput.status = body.status;
    if (body.discoverable !== undefined) updateInput.discoverable = body.discoverable;
    updateInput.updatedBy = (auth as any).user.id;
    
    const article = await articleService.update(c.req.param('id'), updateInput as any);
    if (!article) {
      return c.json({ error: 'Article not found.' }, 404);
    }
    const eventQueue = (c.env as any).EVENT_QUEUE;
    await eventQueue.send({
      eventName: knowledgeBaseEventNames.articleUpdated,
      articleId: article.id,
      installationId: article.installationId,
    });
    return c.json({ article });
  });
  
  knowledgeBaseRoutes.delete('/kb/articles/:id', async (c: Context<E>) => {
    const auth = c.get('auth');
    if (!auth) {
      return c.json({ error: 'Authentication required.' }, 401);
    }
    const db = (c.env as any).DB;
    const installationId = (c.env as any).INSTALLATION_ID ?? 'default-installation';
    const removed = await new ArticleService(db, installationId).remove(c.req.param('id'));
    if (!removed) {
      return c.json({ error: 'Article not found.' }, 404);
    }
    const eventQueue = (c.env as any).EVENT_QUEUE;
    await eventQueue.send({
      eventName: knowledgeBaseEventNames.articleDeleted,
      articleId: c.req.param('id'),
      installationId,
      actorId: (auth as any).user.id,
    });
    return c.json({ success: true });
  });
  
  return knowledgeBaseRoutes;
}
