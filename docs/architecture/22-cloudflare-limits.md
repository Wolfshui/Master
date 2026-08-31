
# Cloudflare Limits, Costs, and Portability Risks

## Platform considerations

- **Workers:** CPU and request limits push us toward short synchronous paths and queued background work.
- **D1:** relational convenience is high, but write throughput and query patterns must stay disciplined.
- **R2:** cost-efficient for blobs and backups, but listing and replication strategies still matter.
- **KV:** eventually consistent, so only projections and cacheable configuration belong there.
- **Queues:** at-least-once delivery demands idempotent consumers.

## Primary cost drivers

- high-frequency auth/session reads without cache strategy
- event fan-out volume and retry storms
- export generation stored in R2
- full-text indexing and rebuild frequency
- large attachment uploads and download egress

## Portability risks

- over-coupling route code to Cloudflare binding shapes
- using KV for authoritative state
- assuming queue ordering guarantees that are not portable
- encoding worker-only globals deep inside domain services

Mitigation is already built into the service-interface packages and the modular monolith boundary rules.
