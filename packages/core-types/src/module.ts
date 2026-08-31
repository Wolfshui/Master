
import type { PermissionAction } from './user';

export type ModuleStatus = 'available' | 'installed' | 'active' | 'inactive' | 'errored' | 'updating';

export interface ModulePermissionDeclaration {
  key: string;
  resource: string;
  action: PermissionAction;
  description: string;
  assignable?: boolean;
}

export interface ModuleRouteDeclaration {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  handler: string;
  permission: string;
  public?: boolean;
}

export interface ModuleSettingField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'secret';
  required?: boolean;
  defaultValue?: string | number | boolean;
  helpText?: string;
  options?: readonly string[];
}

export interface ModuleSettingSection {
  key: string;
  title: string;
  description?: string;
  fields: readonly ModuleSettingField[];
}

export interface ModuleManifest {
  schemaVersion: '1.0.0';
  id: string;
  name: string;
  version: string;
  description: string;
  entrypoint: string;
  compatibility: {
    platform: 'cloudflare-workers';
    sdk: string;
    minimumCoreVersion: string;
    testedCoreVersions?: readonly string[];
  };
  permissions: readonly ModulePermissionDeclaration[];
  routes: readonly ModuleRouteDeclaration[];
  lifecycle: {
    validate?: string;
    install: string;
    activate: string;
    deactivate?: string;
    update: string;
    rollback: string;
    uninstall: string;
    purge?: string;
  };
  assets: {
    package: string;
    integrity: string;
    icon?: string;
    screenshots?: readonly string[];
  };
  events: {
    publishes: readonly string[];
    subscribes: readonly string[];
  };
  settings: {
    sections: readonly ModuleSettingSection[];
  };
  dependencies?: readonly {
    id: string;
    versionRange: string;
    optional?: boolean;
  }[];
  billing?: {
    required?: boolean;
    purchaseType?: 'free' | 'one_time' | 'subscription' | 'seat_based';
    sku?: string;
  };
  support?: {
    url?: string;
    contactEmail?: string;
  };
}

export interface ModuleRecord {
  id: string;
  installationId: string;
  name: string;
  version: string;
  status: ModuleStatus;
  manifest: ModuleManifest;
  installedAt: string;
  updatedAt: string;
}

export interface ModuleLifecycleEvent {
  moduleId: string;
  installationId: string;
  event: 'validated' | 'installed' | 'activated' | 'deactivated' | 'updated' | 'rolled_back' | 'uninstalled' | 'purged';
  version: string;
  actorId: string;
  occurredAt: string;
}
