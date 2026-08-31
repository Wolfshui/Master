
# ADR-007: Shared Forms Engine

- **Status:** Accepted

## Context

The Community Platform OS needs a platform shape that supports rapid iteration, strong governance, and predictable operations while proving the first vertical slice. The architecture must also work well with Cloudflare's operational model.

## Decision

Model forms as a reusable platform capability instead of per-module bespoke inputs.

## Consequences

- Clear shared contracts can be built early.
- Some future scaling choices are intentionally postponed.
- Governance is centralized, which reduces accidental divergence between modules.

## Alternatives considered

- microservices from day one
- separate worker per module
- unmanaged plugin scripts
- bespoke implementations per feature domain

## Trade-offs

The chosen approach favors simplicity, consistency, and faster delivery over maximum isolation. It also means discipline around boundaries is mandatory because process boundaries are not enforcing them for us.

## Security impact

Centralizing this concern improves auditability and policy enforcement. The downside is that mistakes in the core runtime can affect many modules, so hardening and tests are critical.

## Scalability impact

The decision works for the expected early load profile and reduces operational overhead. If bottlenecks emerge, the explicit interfaces give us extraction seams.

## Revisit trigger

Revisit when sustained traffic, module count, or organizational isolation requirements outgrow the modular monolith assumptions, or when Cloudflare limits materially block roadmap goals.
