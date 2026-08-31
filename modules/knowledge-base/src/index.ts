
import type { ModuleManifest } from '@community-os/core-types';
import { ModuleLifecycleHandler, PermissionRegistry } from '@community-os/module-sdk';
import type { ModuleLifecycleContext } from '@community-os/module-sdk';

import manifest from '../manifest.json';
import { knowledgeBasePermissions } from './permissions';
import { createKnowledgeBaseRoutes } from './routes';

export class KnowledgeBaseModule extends ModuleLifecycleHandler {
  public readonly manifest: ModuleManifest = manifest as unknown as ModuleManifest;

  public validate(_context: ModuleLifecycleContext): Promise<void> {
    const permissions = new PermissionRegistry();
    permissions.registerMany(knowledgeBasePermissions);
    return Promise.resolve();
  }

  public install(_context: ModuleLifecycleContext): Promise<void> {
    return Promise.resolve();
  }

  public activate(_context: ModuleLifecycleContext): Promise<void> {
    return Promise.resolve();
  }

  public deactivate(_context: ModuleLifecycleContext): Promise<void> {
    return Promise.resolve();
  }

  public update(_context: ModuleLifecycleContext, _previousVersion: string): Promise<void> {
    return Promise.resolve();
  }

  public rollback(_context: ModuleLifecycleContext, _failedVersion: string): Promise<void> {
    return Promise.resolve();
  }

  public uninstall(_context: ModuleLifecycleContext): Promise<void> {
    return Promise.resolve();
  }

  public purge(_context: ModuleLifecycleContext): Promise<void> {
    return Promise.resolve();
  }
}

export const knowledgeBaseModule = new KnowledgeBaseModule();
export { createKnowledgeBaseRoutes, knowledgeBasePermissions };
