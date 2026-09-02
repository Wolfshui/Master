import { ModuleLifecycleHandler, PermissionRegistry } from '@community-os/module-sdk';
import manifest from '../manifest.json';
import { knowledgeBasePermissions } from './permissions';
import { createKnowledgeBaseRoutes } from './routes';
export class KnowledgeBaseModule extends ModuleLifecycleHandler {
    manifest = manifest;
    validate(_context: unknown) {
        const permissions = new PermissionRegistry();
        permissions.registerMany(knowledgeBasePermissions);
        return Promise.resolve();
    }
    install(_context: unknown) {
        return Promise.resolve();
    }
    activate(_context: unknown) {
        return Promise.resolve();
    }
    deactivate(_context: unknown) {
        return Promise.resolve();
    }
    update(_context: unknown, _previousVersion: unknown) {
        return Promise.resolve();
    }
    rollback(_context: unknown, _failedVersion: unknown) {
        return Promise.resolve();
    }
    uninstall(_context: unknown) {
        return Promise.resolve();
    }
    purge(_context: unknown) {
        return Promise.resolve();
    }
}
export const knowledgeBaseModule = new KnowledgeBaseModule();
export { createKnowledgeBaseRoutes, knowledgeBasePermissions };
