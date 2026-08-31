import type { ModuleManifest } from '@community-os/core-types';

export type JsonSchemaValue =
  | string
  | number
  | boolean
  | null
  | JsonSchemaObject
  | readonly JsonSchemaValue[];

export interface JsonSchemaObject {
  readonly [key: string]: JsonSchemaValue | undefined;
}

export interface ManifestValidationResult {
  valid: boolean;
  errors: readonly string[];
  manifest?: ModuleManifest;
}

export const moduleManifestSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://community-os.dev/schemas/module-manifest.schema.json',
  title: 'Community Platform OS Module Manifest',
  type: 'object',
  additionalProperties: false,
  required: [
    'schemaVersion',
    'id',
    'name',
    'version',
    'description',
    'entrypoint',
    'compatibility',
    'permissions',
    'routes',
    'lifecycle',
    'assets',
    'events',
    'settings',
  ],
  properties: {
    schemaVersion: { type: 'string', const: '1.0.0' },
    id: { type: 'string', pattern: '^[a-z0-9-]+$' },
    name: { type: 'string', minLength: 3 },
    version: { type: 'string', pattern: '^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$' },
    description: { type: 'string', minLength: 20 },
    entrypoint: { type: 'string', minLength: 1 },
    compatibility: {
      type: 'object',
      additionalProperties: false,
      required: ['platform', 'sdk', 'minimumCoreVersion'],
      properties: {
        platform: { type: 'string', const: 'cloudflare-workers' },
        sdk: { type: 'string', minLength: 1 },
        minimumCoreVersion: { type: 'string', pattern: '^[0-9]+\\.[0-9]+\\.[0-9]+$' },
        testedCoreVersions: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
        },
      },
    },
    permissions: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['key', 'resource', 'action', 'description'],
        properties: {
          key: { type: 'string', pattern: '^[a-z0-9.-]+$' },
          resource: { type: 'string', minLength: 1 },
          action: {
            type: 'string',
            enum: ['create', 'read', 'update', 'delete', 'manage', 'publish', 'install'],
          },
          description: { type: 'string', minLength: 5 },
          assignable: { type: 'boolean' },
        },
      },
    },
    routes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['path', 'method', 'handler', 'permission'],
        properties: {
          path: { type: 'string', pattern: '^/' },
          method: {
            type: 'string',
            enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          },
          handler: { type: 'string', minLength: 1 },
          permission: { type: 'string', minLength: 1 },
          public: { type: 'boolean' },
        },
      },
    },
    lifecycle: {
      type: 'object',
      additionalProperties: false,
      required: ['install', 'activate', 'update', 'rollback', 'uninstall'],
      properties: {
        validate: { type: 'string' },
        install: { type: 'string' },
        activate: { type: 'string' },
        deactivate: { type: 'string' },
        update: { type: 'string' },
        rollback: { type: 'string' },
        uninstall: { type: 'string' },
        purge: { type: 'string' },
      },
    },
    assets: {
      type: 'object',
      additionalProperties: false,
      required: ['package', 'integrity'],
      properties: {
        package: { type: 'string', minLength: 1 },
        integrity: { type: 'string', pattern: '^sha256-' },
        icon: { type: 'string' },
        screenshots: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    events: {
      type: 'object',
      additionalProperties: false,
      required: ['publishes', 'subscribes'],
      properties: {
        publishes: {
          type: 'array',
          items: { type: 'string', pattern: '^[a-z0-9.-]+\\.v[0-9]+$' },
        },
        subscribes: {
          type: 'array',
          items: { type: 'string', pattern: '^[a-z0-9.-]+\\.v[0-9]+$' },
        },
      },
    },
    settings: {
      type: 'object',
      additionalProperties: false,
      required: ['sections'],
      properties: {
        sections: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['key', 'title', 'fields'],
            properties: {
              key: { type: 'string', pattern: '^[a-z0-9-]+$' },
              title: { type: 'string', minLength: 1 },
              description: { type: 'string' },
              fields: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['key', 'label', 'type'],
                  properties: {
                    key: { type: 'string', pattern: '^[a-z0-9.-]+$' },
                    label: { type: 'string', minLength: 1 },
                    type: {
                      type: 'string',
                      enum: ['text', 'textarea', 'number', 'boolean', 'select', 'secret'],
                    },
                    required: { type: 'boolean' },
                    defaultValue: {},
                    helpText: { type: 'string' },
                    options: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    dependencies: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'versionRange'],
        properties: {
          id: { type: 'string', pattern: '^[a-z0-9-]+$' },
          versionRange: { type: 'string', minLength: 1 },
          optional: { type: 'boolean' },
        },
      },
    },
    billing: {
      type: 'object',
      additionalProperties: false,
      properties: {
        required: { type: 'boolean' },
        purchaseType: {
          type: 'string',
          enum: ['free', 'one_time', 'subscription', 'seat_based'],
        },
        sku: { type: 'string' },
      },
    },
    support: {
      type: 'object',
      additionalProperties: false,
      properties: {
        url: { type: 'string', format: 'uri' },
        contactEmail: { type: 'string', format: 'email' },
      },
    },
  },
} as const satisfies JsonSchemaObject;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export class ManifestValidator {
  public validate(candidate: unknown): ManifestValidationResult {
    const errors: string[] = [];

    if (!isRecord(candidate)) {
      return { valid: false, errors: ['Manifest must be an object.'] };
    }

    const requiredKeys = [
      'schemaVersion',
      'id',
      'name',
      'version',
      'description',
      'entrypoint',
      'compatibility',
      'permissions',
      'routes',
      'lifecycle',
      'assets',
      'events',
      'settings',
    ] as const;

    for (const key of requiredKeys) {
      if (!(key in candidate)) {
        errors.push(`Missing required property: ${key}.`);
      }
    }

    if (candidate.schemaVersion !== '1.0.0') {
      errors.push('schemaVersion must equal 1.0.0.');
    }

    if (!isNonEmptyString(candidate.id) || !/^[a-z0-9-]+$/.test(candidate.id)) {
      errors.push('id must be kebab-case.');
    }

    if (!isNonEmptyString(candidate.name) || candidate.name.length < 3) {
      errors.push('name must be at least 3 characters long.');
    }

    if (
      !isNonEmptyString(candidate.version) ||
      !/^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/.test(candidate.version)
    ) {
      errors.push('version must be a semantic version.');
    }

    if (!isNonEmptyString(candidate.description) || candidate.description.length < 20) {
      errors.push('description must be at least 20 characters long.');
    }

    if (!isNonEmptyString(candidate.entrypoint)) {
      errors.push('entrypoint must be a non-empty string.');
    }

    if (!isRecord(candidate.compatibility) || candidate.compatibility.platform !== 'cloudflare-workers') {
      errors.push('compatibility.platform must equal cloudflare-workers.');
    }

    if (!Array.isArray(candidate.permissions) || candidate.permissions.length === 0) {
      errors.push('permissions must contain at least one declaration.');
    }

    if (!Array.isArray(candidate.routes)) {
      errors.push('routes must be an array.');
    }

    if (!isRecord(candidate.lifecycle)) {
      errors.push('lifecycle must be an object.');
    }

    if (
      !isRecord(candidate.assets) ||
      !isNonEmptyString(candidate.assets.package) ||
      !isNonEmptyString(candidate.assets.integrity)
    ) {
      errors.push('assets.package and assets.integrity must be declared.');
    }

    if (
      !isRecord(candidate.events) ||
      !Array.isArray(candidate.events.publishes) ||
      !Array.isArray(candidate.events.subscribes)
    ) {
      errors.push('events must declare publishes and subscribes arrays.');
    }

    if (!isRecord(candidate.settings) || !Array.isArray(candidate.settings.sections)) {
      errors.push('settings.sections must be an array.');
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return {
      valid: true,
      errors: [],
      manifest: candidate as unknown as ModuleManifest,
    };
  }

  public validateJson(serialized: string): ManifestValidationResult {
    try {
      return this.validate(JSON.parse(serialized));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown JSON parse error.';
      return { valid: false, errors: [message] };
    }
  }
}
