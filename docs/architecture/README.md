
# Community Platform OS Architecture

This package captures the target architecture for a Cloudflare-native Community Platform Operating System (CPOS). It defines the operating model, module contracts, first vertical slice, delivery roadmap, and the guardrails required to keep a modular monolith cohesive while still being marketplace-ready.

## Document map

1. [Executive summary](./01-executive-summary.md)
2. [Requirements](./02-requirements.md)
3. [C4 diagrams](./03-c4-diagrams.md)
4. [Cloudflare deployment](./04-cloudflare-deployment.md)
5. [Domain model](./05-domain-model.md)
6. [Service interfaces](./06-service-interfaces.md)
7. [Module manifest schema](./07-module-manifest-schema.md)
8. [Module SDK](./08-module-sdk.md)
9. [Permission model](./09-permission-model.md)
10. [Event schema](./10-event-schema.md)
11. [Forms and workflow schemas](./11-forms-workflow-schemas.md)
12. [Content model](./12-content-model.md)
13. [Marketplace and licensing](./13-marketplace-licensing.md)
14. [Update and rollback](./14-update-rollback.md)
15. [Search, reporting, and export](./15-search-reporting-export.md)
16. [Backup and recovery](./16-backup-recovery.md)
17. [Threat model](./17-threat-model.md)
18. [Accessibility and UX](./18-accessibility-ux.md)
19. [Design tokens](./19-design-tokens.md)
20. [Knowledge base spec](./20-knowledge-base-spec.md)
21. [Testing and CI/CD](./21-testing-cicd.md)
22. [Cloudflare limits and portability](./22-cloudflare-limits.md)
23. [Roadmap](./23-roadmap.md)
24. [Prioritized backlog](./24-backlog.md)
25. [Architecture decisions](./adrs/)

## Architectural stance

- **Deployment model:** Cloudflare Workers for edge APIs and experience delivery, D1 for relational state, R2 for package/blob storage, Queues for asynchronous work, KV for low-latency cache, and Durable Objects only where strict coordination is needed.
- **Product shape:** modular monolith with explicit domain boundaries. Modules are first-class packages, but execute inside a centrally governed runtime with common auth, RBAC, audit, search, and eventing.
- **First vertical slice:** owner bootstrap, login/session, module catalog, and a knowledge-base module with CRUD scaffolding.
- **Design priorities:** deny-by-default permissions, event versioning, signed module packages, accessibility, operational recovery, and Cloudflare portability awareness.
