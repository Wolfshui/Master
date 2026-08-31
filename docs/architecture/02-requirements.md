
# Requirements

## Functional requirements

- Bootstrap a new installation with a single protected owner account.
- Authenticate users with secure session issuance, revocation, expiration, and audit logging.
- Represent modules through a signed manifest, install them with lifecycle hooks, and track status.
- Provide core services to modules: data, object storage, event publishing, queueing, caching, notifications, licensing, and search.
- Support RBAC with deny-by-default evaluation, owner protection, and module-scoped permissions.
- Model forms, workflow, content, and knowledge articles as first-class domains.
- Emit versioned domain events with idempotency and loop-prevention metadata.
- Offer health endpoints, operational exports, and deployment documentation.

## Non-functional requirements

- Edge-first latency targets for reads and auth checks.
- Strict TypeScript contracts with no implicit any usage.
- D1-compatible relational schema and migration ordering.
- Accessibility target of WCAG 2.2 AA.
- Auditability for privileged actions, auth flows, module lifecycle changes, and exports.
- Portable domain contracts so that a future non-Cloudflare implementation can reuse the core packages.
- Safe failure modes: rollback, replay, retry, and backup packages.

## Assumptions

- Each installation is a logically isolated tenant in shared infrastructure.
- Central identity is authoritative even when modules integrate external providers.
- Search indexes are derived artifacts and may be rebuilt.
- Cloudflare Queues provide at-least-once delivery, so consumers must be idempotent.
- R2 holds module packages, large exports, and recovery bundles rather than transactional data.

## Deferred capabilities

- SSO federation, SCIM, and advanced identity brokering
- visual workflow designer
- marketplace billing settlement and tax handling
- rich analytics warehouse offload
- cross-installation collaboration or federation

## Open risks

| Risk | Why it matters | Initial mitigation |
| --- | --- | --- |
| D1 write contention | central services can become chatty | keep writes coarse-grained, batch events, reserve Durable Objects for strict coordination |
| Queue replay loops | events can fan out recursively | enforce idempotency keys, loop guards, and hop counters |
| Module manifest drift | installed behavior can diverge from reviewed package | persist manifest hash, signature, and package digest |
| Export abuse | privileged users can exfiltrate data | permission-aware export policies, row caps, and audit trails |
| Edge crypto misuse | password security could regress | standardize PBKDF2 parameters and stored hash format in the identity service |
