import { ModuleLifecycleHandler, PermissionRegistry } from '@community-os/module-sdk';
import manifest from '../manifest.json';
import { knowledgeBasePermissions } from './permissions';
import { createKnowledgeBaseRoutes } from './routes';
export class KnowledgeBaseModule extends ModuleLifecycleHandler {
    manifest = manifest;
    validate(_context: any) {
        const permissions = new PermissionRegistry();
        permissions.registerMany(knowledgeBasePermissions);
        return Promise.resolve();
    }
    install(_context: any) {
        return Promise.resolve();
    }
    activate(_context: any) {
        return Promise.resolve();
    }
    deactivate(_context: any) {
        return Promise.resolve();
    }
    update(_context: any, _previousVersion: any) {
        return Promise.resolve();
    }
    rollback(_context: any, _failedVersion: any) {
        return Promise.resolve();
    }
    uninstall(_context: any) {
        return Promise.resolve();
    }
    purge(_context: any) {
        return Promise.resolve();
    }
}
export const knowledgeBaseModule = new KnowledgeBaseModule();
export { createKnowledgeBaseRoutes, knowledgeBasePermissions };
