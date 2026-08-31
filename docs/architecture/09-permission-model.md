
# Permission Model

The authorization model is role-based with explicit permissions, deny-by-default evaluation, and owner protections that cannot be removed by normal administrators.

## RBAC rules

- A user gains effective access only through explicit role assignments plus immutable owner grants.
- Missing permission equals deny.
- Module permissions must be namespaced (for example `knowledge-base.article.publish`).
- Protected permissions such as owner bootstrap, module install, backup restore, and RBAC mutation require elevated review in the UI and audit log enrichment.

## Owner protection

- The first owner is created only through `/setup` when no user exists.
- Owner access cannot be removed from the last active owner.
- Owners bypass role assignment gaps for break-glass administration, but their actions remain audited.

## Permission matrix

| Capability | Owner | Admin role | Editor role | Viewer role |
| --- | --- | --- | --- | --- |
| Complete setup | Allow | Deny | Deny | Deny |
| Install or update modules | Allow | Allow | Deny | Deny |
| Manage roles and permissions | Allow | Allow | Deny | Deny |
| Create and edit content | Allow | Allow | Allow | Deny |
| Publish knowledge articles | Allow | Allow | Allow with publish grant | Deny |
| Export reports | Allow | Allow when granted | Deny | Deny |
| View audit logs | Allow | Allow when granted | Deny | Deny |

## Evaluation order

1. Resolve user session.
2. Apply immutable owner grants if `isOwner` is true.
3. Aggregate role permissions.
4. Filter by installation, module activation status, and route policy.
5. Apply resource ownership rules when relevant.
6. Return deny if no explicit allow remains.
