import { ModuleLifecycleHandler, PermissionRegistry } from '@community-os/module-sdk';
import manifest from '../manifest.json';
import { knowledgeBasePermissions } from './permissions';
import { createKnowledgeBaseRoutes } from './routes';
export class KnowledgeBaseModule extends ModuleLifecycleHandler {
    manifest = manifest;
    validate(_context) {
        const permissions = new PermissionRegistry();
        permissions.registerMany(knowledgeBasePermissions);
        return Promise.resolve();
    }
    install(_context) {
        return Promise.resolve();
    }
    activate(_context) {
        return Promise.resolve();
    }
    deactivate(_context) {
        return Promise.resolve();
    }
    update(_context, _previousVersion) {
        return Promise.resolve();
    }
    rollback(_context, _failedVersion) {
        return Promise.resolve();
    }
    uninstall(_context) {
        return Promise.resolve();
    }
    purge(_context) {
        return Promise.resolve();
    }
}
export const knowledgeBaseModule = new KnowledgeBaseModule();
export { createKnowledgeBaseRoutes, knowledgeBasePermissions };
