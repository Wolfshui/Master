# Module Manifest Schema

The manifest is the contract between the core runtime, marketplace, and module package. Runtime validation happens before installation, activation, or update.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://community-os.dev/schemas/module-manifest.schema.json",
  "title": "Community Platform OS Module Manifest",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schemaVersion",
    "id",
    "name",
    "version",
    "description",
    "entrypoint",
    "compatibility",
    "permissions",
    "routes",
    "lifecycle",
    "assets",
    "events",
    "settings"
  ],
  "properties": {
    "schemaVersion": {
      "type": "string",
      "const": "1.0.0"
    },
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$"
    },
    "name": {
      "type": "string",
      "minLength": 3
    },
    "version": {
      "type": "string",
      "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$"
    },
    "description": {
      "type": "string",
      "minLength": 20
    },
    "entrypoint": {
      "type": "string",
      "minLength": 1
    },
    "compatibility": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "platform",
        "sdk",
        "minimumCoreVersion"
      ],
      "properties": {
        "platform": {
          "type": "string",
          "const": "cloudflare-workers"
        },
        "sdk": {
          "type": "string",
          "minLength": 1
        },
        "minimumCoreVersion": {
          "type": "string",
          "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$"
        },
        "testedCoreVersions": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1
        }
      }
    },
    "permissions": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "key",
          "resource",
          "action",
          "description"
        ],
        "properties": {
          "key": {
            "type": "string",
            "pattern": "^[a-z0-9.-]+$"
          },
          "resource": {
            "type": "string",
            "minLength": 1
          },
          "action": {
            "type": "string",
            "enum": [
              "create",
              "read",
              "update",
              "delete",
              "manage",
              "publish",
              "install"
            ]
          },
          "description": {
            "type": "string",
            "minLength": 5
          },
          "assignable": {
            "type": "boolean"
          }
        }
      }
    },
    "routes": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "path",
          "method",
          "handler",
          "permission"
        ],
        "properties": {
          "path": {
            "type": "string",
            "pattern": "^/"
          },
          "method": {
            "type": "string",
            "enum": [
              "GET",
              "POST",
              "PUT",
              "PATCH",
              "DELETE"
            ]
          },
          "handler": {
            "type": "string",
            "minLength": 1
          },
          "permission": {
            "type": "string",
            "minLength": 1
          },
          "public": {
            "type": "boolean"
          }
        }
      }
    },
    "lifecycle": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "install",
        "activate",
        "update",
        "rollback",
        "uninstall"
      ],
      "properties": {
        "validate": {
          "type": "string"
        },
        "install": {
          "type": "string"
        },
        "activate": {
          "type": "string"
        },
        "deactivate": {
          "type": "string"
        },
        "update": {
          "type": "string"
        },
        "rollback": {
          "type": "string"
        },
        "uninstall": {
          "type": "string"
        },
        "purge": {
          "type": "string"
        }
      }
    },
    "assets": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "package",
        "integrity"
      ],
      "properties": {
        "package": {
          "type": "string",
          "minLength": 1
        },
        "integrity": {
          "type": "string",
          "pattern": "^sha256-"
        },
        "icon": {
          "type": "string"
        },
        "screenshots": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "events": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "publishes",
        "subscribes"
      ],
      "properties": {
        "publishes": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^[a-z0-9.-]+\\.v[0-9]+$"
          }
        },
        "subscribes": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^[a-z0-9.-]+\\.v[0-9]+$"
          }
        }
      }
    },
    "settings": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "sections"
      ],
      "properties": {
        "sections": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "key",
              "title",
              "fields"
            ],
            "properties": {
              "key": {
                "type": "string",
                "pattern": "^[a-z0-9-]+$"
              },
              "title": {
                "type": "string",
                "minLength": 1
              },
              "description": {
                "type": "string"
              },
              "fields": {
                "type": "array",
                "items": {
                  "type": "object",
                  "additionalProperties": false,
                  "required": [
                    "key",
                    "label",
                    "type"
                  ],
                  "properties": {
                    "key": {
                      "type": "string",
                      "pattern": "^[a-z0-9.-]+$"
                    },
                    "label": {
                      "type": "string",
                      "minLength": 1
                    },
                    "type": {
                      "type": "string",
                      "enum": [
                        "text",
                        "textarea",
                        "number",
                        "boolean",
                        "select",
                        "secret"
                      ]
                    },
                    "required": {
                      "type": "boolean"
                    },
                    "defaultValue": {},
                    "helpText": {
                      "type": "string"
                    },
                    "options": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "dependencies": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "versionRange"
        ],
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^[a-z0-9-]+$"
          },
          "versionRange": {
            "type": "string",
            "minLength": 1
          },
          "optional": {
            "type": "boolean"
          }
        }
      }
    },
    "billing": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "required": {
          "type": "boolean"
        },
        "purchaseType": {
          "type": "string",
          "enum": [
            "free",
            "one_time",
            "subscription",
            "seat_based"
          ]
        },
        "sku": {
          "type": "string"
        }
      }
    },
    "support": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "url": {
          "type": "string",
          "format": "uri"
        },
        "contactEmail": {
          "type": "string",
          "format": "email"
        }
      }
    }
  }
}
```

## Validation principles

- `schemaVersion` gates runtime parsing rules.
- All permissions and routes must be declared up front so review and policy engines can reason about module blast radius.
- Asset integrity is mandatory so packages can be verified before activation.
- Event names must be versioned to allow parallel consumers during rolling upgrades.
