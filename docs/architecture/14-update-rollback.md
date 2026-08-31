
# Update and Rollback

## Semantic versioning policy

- `major` for breaking manifest, API, event, or permission changes.
- `minor` for backward-compatible feature additions.
- `patch` for safe fixes and non-breaking internal changes.

## Signed packages

Every module package includes a digest and signature recorded in the manifest. The runtime verifies both before install or activation.

## Staged rollout

1. Validate manifest and entitlement.
2. Download and verify package.
3. Run migrations in maintenance mode for the module.
4. Activate health probes.
5. Flip status to active only after health checks pass.

## Automatic rollback

The runtime rolls back when activation hooks fail, probe checks exceed thresholds, or critical migrations are not reversible. Rollback restores the previous package pointer, deactivates new routes, and emits audit and lifecycle events.
