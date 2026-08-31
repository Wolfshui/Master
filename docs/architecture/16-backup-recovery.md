
# Backup and Recovery

## Strategy

- **D1 backup:** scheduled SQL exports or logical snapshots of core tables.
- **R2 backup:** versioned object replication manifest plus periodic integrity scan.
- **KV backup:** regenerate from source of truth where possible; export critical keys otherwise.

## Recovery package

A recovery bundle stored in R2 contains:

- D1 schema and data export
- manifest of R2 keys and checksums
- installed module versions and digests
- environment configuration metadata
- restore instructions and validation checksums

## Health checks

- `/api/v1/health` verifies runtime responsiveness.
- synthetic setup/login/module queries validate core dependencies.
- backup jobs emit events and audit records on success or failure.
