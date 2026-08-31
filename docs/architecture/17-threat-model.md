
# Threat Model

| Threat | Attack path | Impact | Mitigation |
| --- | --- | --- | --- |
| Credential stuffing | repeated login attempts against edge auth | account takeover | PBKDF2 hashing, rate limiting, session revocation, audit alerts |
| Session theft | stolen cookie or token replay | unauthorized access | hashed session tokens at rest, secure httpOnly cookies, rotation on login, expiration |
| Privilege escalation | manipulated role assignments or undeclared module permissions | administrative compromise | deny-by-default RBAC, owner protection, manifest permission review, audit logs |
| Malicious module package | tampered archive or unexpected routes | code and data compromise | signed packages, manifest digest verification, curated module install pipeline |
| Queue replay loop | recursive event subscribers | runaway costs and duplicated state changes | idempotency keys, loopGuard, hopCount, dead-letter policies |
| D1 injection | unsafely composed SQL | data corruption or leakage | parameterized queries, typed services, narrow repositories |
| Cross-tenant data leak | missing installation filters | confidentiality breach | installationId required in service APIs, row-level query guards, integration tests |
| Export exfiltration | over-broad CSV/report access | sensitive data loss | explicit export permissions, row caps, CSV sanitization, audit records |
| Stored content XSS | unsafe rendering of article content | browser compromise | sanitize rich content, escape defaults, content security headers |
| R2 object exposure | public bucket misconfiguration | package or attachment leakage | signed URLs, private buckets, checksum validation |
| Workflow abuse | unauthorized transition invocation | process tampering | transition-level permissions, state guard predicates, audit trails |
| Supply-chain dependency risk | vulnerable npm packages | widespread compromise | dependency review, advisory checks, lockfiles, CI scanning |
