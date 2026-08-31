
# Module SDK

The SDK gives module authors a narrow, typed integration surface. Modules are packages, not arbitrary worker deployments. They execute inside the core runtime, inherit centralized auth and auditing, and can only access infrastructure through approved service interfaces.

## SDK outline

- `ManifestValidator` for schema validation and safe coercion.
- `ModuleLifecycleHandler` abstract class to standardize lifecycle hooks.
- `PermissionRegistry` to register module-owned permissions.
- `EventPublisher` and `EventSubscriber` contracts for event interaction.
- `RouteDefinition` for declarative HTTP route metadata.
- `SettingsSchema` for strongly typed configuration UI generation.

## Lifecycle

1. **validate** – confirm manifest integrity, dependency ranges, and preflight data assumptions.
2. **install** – run migrations, seed permissions, prepare storage.
3. **activate** – expose routes, background consumers, and search registrations.
4. **deactivate** – stop serving features while retaining state.
5. **update** – apply forward-only changes inside a staged transaction boundary.
6. **rollback** – restore the previously known-good package when health checks fail.
7. **uninstall** – remove runtime access while keeping retained records according to policy.
8. **purge** – permanently delete retained state only when policy explicitly allows it.

## Isolation model

- **Code isolation:** modules are reviewed packages loaded into the shared runtime, not untrusted scripts.
- **Data isolation:** modules own tables/namespaces by prefix and must go through `DataService`.
- **Permission isolation:** route access is declared in manifest metadata and enforced centrally.
- **Operational isolation:** module errors are tagged with module identifiers in audit and event streams.
- **Lifecycle isolation:** activation is staged; failed activation never silently flips a module to active.
