
import type { ModulePermissionDeclaration } from '@community-os/core-types';

export const knowledgeBasePermissions: readonly ModulePermissionDeclaration[] = [
  {
    key: 'knowledge-base.article.read',
    resource: 'knowledge-base.article',
    action: 'read',
    description: 'Read knowledge base articles',
    assignable: true,
  },
  {
    key: 'knowledge-base.article.write',
    resource: 'knowledge-base.article',
    action: 'update',
    description: 'Create and edit knowledge base articles',
    assignable: true,
  },
  {
    key: 'knowledge-base.article.publish',
    resource: 'knowledge-base.article',
    action: 'publish',
    description: 'Publish knowledge base articles',
    assignable: true,
  },
  {
    key: 'knowledge-base.article.manage',
    resource: 'knowledge-base.article',
    action: 'manage',
    description: 'Delete or archive knowledge base articles',
    assignable: false,
  },
];
