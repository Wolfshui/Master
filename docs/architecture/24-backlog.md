
# Prioritized Backlog

| Priority | Item | Outcome | Acceptance signal |
| --- | --- | --- | --- |
| P0 | Owner bootstrap hardening | Safe first-user creation | Setup only works once and audits the action |
| P0 | Session middleware | Shared authenticated route guard | Protected routes resolve user/session from cookie |
| P0 | Module manifest validator | Safe install boundary | Invalid manifests are rejected with actionable errors |
| P0 | Knowledge-base CRUD | First vertical slice | CRUD routes persist and fetch articles |
| P1 | Role management APIs | Delegated administration | Admins can assign roles without breaking owner protection |
| P1 | Event consumer framework | Async workflows | Consumers process idempotent events from queues |
| P1 | Search indexing | Discoverability | Published KB items are queryable by permission-aware search |
| P1 | Audit viewer | Operational oversight | Privileged actions are visible in UI |
| P2 | Forms builder | Structured intake | Operators can create form definitions |
| P2 | Workflow runner | Controlled state transitions | Submissions advance instances through guarded transitions |
| P2 | Export jobs | Safe reporting | Exports are queued, sanitized, and audited |
| P3 | Marketplace checkout | Commercial module flow | Entitlements are issued from successful purchases |
| P3 | SSO integration | Enterprise adoption | External identity can authenticate into central sessions |
