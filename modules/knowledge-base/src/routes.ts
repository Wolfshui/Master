
import type { AuthenticatedSession } from '@community-os/core-types';
import { Hono } from 'hono';
import type { Context } from 'hono';

import { knowledgeBaseEventNames } from './events';
import type { KnowledgeBaseAppEnv } from './runtime-types';
import { ArticleService } from './services/article.service';

function getAuth<T extends KnowledgeBaseAppEnv>(c: Context<T>): AuthenticatedSession | null {
  return c.get('auth') as AuthenticatedSession | null;
}

function ensureAuth<T extends KnowledgeBaseAppEnv>(
  c: Context<T>,
): { auth: AuthenticatedSession; response?: undefined } | { auth?: undefined; response: Response } {
  const auth = getAuth(c);
  if (!auth) {
    return { response: c.json({ error: 'Authentication required.' }, 401) };
  }
  return { auth };
}

function installationId<T extends KnowledgeBaseAppEnv>(c: Context<T>): string {
  return c.env.INSTALLATION_ID ?? 'default-installation';
}

export function createKnowledgeBaseRoutes<T extends KnowledgeBaseAppEnv>() {
  const knowledgeBaseRoutes = new Hono<T>();

  knowledgeBaseRoutes.get('/kb/articles', async (c) => {
    const result = ensureAuth(c);
    if (result.response) {
      return result.response;
    }

    const articles = await new ArticleService(c.env.DB, installationId(c)).list();
    return c.json({ articles });
  });

  knowledgeBaseRoutes.get('/kb/articles/:id', async (c) => {
    const result = ensureAuth(c);
    if (result.response) {
      return result.response;
    }

    const article = await new ArticleService(c.env.DB, installationId(c)).getById(c.req.param('id'));
    if (!article) {
      return c.json({ error: 'Article not found.' }, 404);
    }

    return c.json({ article });
  });

  knowledgeBaseRoutes.post('/kb/articles', async (c) => {
    const result = ensureAuth(c);
    if (result.response) {
      return result.response;
    }

    const body = await c.req.json<{
      title: string;
      slug: string;
      summary: string;
      category: string;
      bodyMarkdown: string;
      locale?: string;
      status?: 'draft' | 'published' | 'archived';
      discoverable?: boolean;
    }>();
    const articleService = new ArticleService(c.env.DB, installationId(c));
    const article = await articleService.create({
      title: body.title,
      slug: body.slug,
      summary: body.summary,
      category: body.category,
      bodyMarkdown: body.bodyMarkdown,
      locale: body.locale ?? 'en',
      status: body.status ?? 'draft',
      discoverable: body.discoverable ?? true,
      createdBy: result.auth.user.id,
      updatedBy: result.auth.user.id,
    });

    await c.env.EVENT_QUEUE.send({
      eventName: knowledgeBaseEventNames.articleCreated,
      articleId: article.id,
      installationId: article.installationId,
    });

    return c.json({ article }, 201);
  });

  knowledgeBaseRoutes.put('/kb/articles/:id', async (c) => {
    const result = ensureAuth(c);
    if (result.response) {
      return result.response;
    }

    const articleService = new ArticleService(c.env.DB, installationId(c));
    const body = await c.req.json<{
      title?: string;
      slug?: string;
      summary?: string;
      category?: string;
      bodyMarkdown?: string;
      locale?: string;
      status?: 'draft' | 'published' | 'archived';
      discoverable?: boolean;
    }>();

    const updateInput = {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.slug !== undefined ? { slug: body.slug } : {}),
      ...(body.summary !== undefined ? { summary: body.summary } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.bodyMarkdown !== undefined ? { bodyMarkdown: body.bodyMarkdown } : {}),
      ...(body.locale !== undefined ? { locale: body.locale } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.discoverable !== undefined ? { discoverable: body.discoverable } : {}),
      updatedBy: result.auth.user.id,
    };

    const article = await articleService.update(c.req.param('id'), updateInput);

    if (!article) {
      return c.json({ error: 'Article not found.' }, 404);
    }

    await c.env.EVENT_QUEUE.send({
      eventName: knowledgeBaseEventNames.articleUpdated,
      articleId: article.id,
      installationId: article.installationId,
    });

    return c.json({ article });
  });

  knowledgeBaseRoutes.delete('/kb/articles/:id', async (c) => {
    const result = ensureAuth(c);
    if (result.response) {
      return result.response;
    }

    const removed = await new ArticleService(c.env.DB, installationId(c)).remove(c.req.param('id'));
    if (!removed) {
      return c.json({ error: 'Article not found.' }, 404);
    }

    await c.env.EVENT_QUEUE.send({
      eventName: knowledgeBaseEventNames.articleDeleted,
      articleId: c.req.param('id'),
      installationId: installationId(c),
      actorId: result.auth.user.id,
    });

    return c.json({ success: true });
  });

  return knowledgeBaseRoutes;
}
