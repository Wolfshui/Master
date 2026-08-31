
import { describe, expect, it } from 'vitest';

import { ManifestValidator } from '../manifest';

describe('ManifestValidator', () => {
  const validator = new ManifestValidator();

  it('validates a complete manifest', () => {
    const result = validator.validate({
      schemaVersion: '1.0.0',
      id: 'knowledge-base',
      name: 'Knowledge Base',
      version: '1.0.0',
      description: 'Knowledge base module for managed article content.',
      entrypoint: './src/index.ts',
      compatibility: {
        platform: 'cloudflare-workers',
        sdk: '0.1.0',
        minimumCoreVersion: '0.1.0',
      },
      permissions: [
        {
          key: 'knowledge-base.article.read',
          resource: 'knowledge-base.article',
          action: 'read',
          description: 'Read knowledge base articles',
        },
      ],
      routes: [
        {
          path: '/api/v1/kb/articles',
          method: 'GET',
          handler: 'listArticles',
          permission: 'knowledge-base.article.read',
        },
      ],
      lifecycle: {
        install: 'install',
        activate: 'activate',
        update: 'update',
        rollback: 'rollback',
        uninstall: 'uninstall',
      },
      assets: {
        package: 'r2://packages/knowledge-base-1.0.0.tgz',
        integrity: 'sha256-abc123',
      },
      events: {
        publishes: ['knowledge-base.article.created.v1'],
        subscribes: [],
      },
      settings: {
        sections: [],
      },
    });

    expect(result.valid).toBe(true);
    expect(result.manifest?.id).toBe('knowledge-base');
  });

  it('rejects invalid identifiers', () => {
    const result = validator.validate({
      schemaVersion: '1.0.0',
      id: 'KnowledgeBase',
      name: 'KB',
      version: '1',
      description: 'short',
      entrypoint: '',
      compatibility: {
        platform: 'other',
      },
      permissions: [],
      routes: [],
      lifecycle: {},
      assets: {},
      events: {},
      settings: {},
    });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
