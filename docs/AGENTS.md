# Agent Project Map — Community Platform OS

This document is the **authoritative guide for AI agents** working in this repository.
Read it completely before touching any file. It answers: what this project is, how it is
structured, what the rules are, and how to make changes safely.

---

## 1. What This Project Is

**Community Platform OS** is a self-hosted, Cloudflare-native modular platform for small
organizations (conventions, clubs, nonprofits, gaming groups, event spaces). Think
WordPress-style plugin ecosystem but built entirely on Cloudflare Workers, D1, R2, KV,
Queues, and Durable Objects.

Key facts you must never contradict:

| Fact | Value |
|---|---|
| Runtime | Cloudflare Workers (not Node.js in production) |
| Database | Cloudflare D1 (SQLite dialect) |
| Object storage | Cloudflare R2 |
| Cache | Cloudflare Workers KV |
| Async jobs | Cloudflare Queues |
| Package manager | pnpm 10.4.1 (workspaces) |
| Build orchestrator | Turborepo 2 |
| Language | TypeScript 5 — strict mode everywhere |
| API framework | Hono (Cloudflare Workers) |
| UI framework | React 19 + Vite + TailwindCSS v4 |
| Test runner | Vitest 3 |
| Node version | 20 (see `.nvmrc`) |
| Crypto | Web Crypto API / SubtleCrypto (PBKDF2) — never use bcrypt or Node `crypto` |

The platform is a **modular monolith** at this stage. Do not introduce microservices,
Kubernetes, or any distributed infrastructure not already present.

---

## 2. Repository Map

```
/
├── apps/
│   ├── web/                  React 19 + Vite + TailwindCSS v4 SPA / PWA
│   │   ├── src/
│   │   │   ├── App.tsx               Router shell
│   │   │   ├── design-tokens.css     CSS custom properties (single source of truth)
│   │   │   ├── components/
│   │   │   │   ├── ui/               Reusable accessible UI primitives
│   │   │   │   └── layout/           PublicLayout, AppLayout
│   │   │   └── pages/                LoginPage, SetupPage, DashboardPage
│   │   ├── index.html
│   │   └── vite.config.ts
│   │
│   └── worker/               Cloudflare Worker — all API and platform logic
│       ├── src/
│       │   ├── index.ts              Hono app entry, registers all routes
│       │   ├── types.ts              EnvBindings, AppVariables, D1/R2/KV types
│       │   ├── middleware/
│       │   │   ├── auth.ts           Session authentication middleware
│       │   │   └── cors.ts           CORS policy middleware
│       │   ├── routes/
│       │   │   ├── auth.ts           POST /api/v1/auth/{login,logout,session,setup}
│       │   │   ├── modules.ts        GET/POST /api/v1/modules
│       │   │   └── health.ts         GET /api/v1/health
│       │   ├── services/
│       │   │   ├── identity.ts       IdentityService — PBKDF2 hashing, session mgmt
│       │   │   ├── audit.ts          AuditService — structured D1 audit entries
│       │   │   └── event-bus.ts      EventBus — in-process + Queue delivery
│       │   └── db/migrations/        D1 SQL migration files (SQLite syntax)
│       │       ├── 0001_create_users.sql
│       │       ├── 0002_create_roles_permissions.sql
│       │       ├── 0003_create_sessions.sql
│       │       ├── 0004_create_modules.sql
│       │       ├── 0005_create_audit_log.sql
│       │       ├── 0006_create_events.sql
│       │       ├── 0007_create_forms.sql
│       │       ├── 0008_create_workflow.sql
│       │       ├── 0009_create_content.sql
│       │       └── 0010_create_kb_articles.sql
│       └── wrangler.toml             Cloudflare bindings (D1, R2, KV, Queues)
│
├── packages/
│   ├── core-types/           Shared TypeScript types consumed by everything
│   │   └── src/
│   │       ├── user.ts               User, Role, Permission, Session, Owner
│   │       ├── module.ts             ModuleManifest, ModuleStatus, lifecycle events
│   │       ├── event.ts              EventEnvelope, CoreEventNames, DataClassification
│   │       ├── form.ts               FormDefinition, FormField, FieldType, FormSubmission
│   │       ├── workflow.ts           WorkflowDefinition, WorkflowState, WorkflowInstance
│   │       ├── content.ts            ContentItem, ContentRevision, ContentStatus
│   │       ├── audit.ts              AuditEntry, AuditCategory
│   │       ├── entitlement.ts        Entitlement, LicenseKey, PurchaseType
│   │       ├── services.ts           All platform service interfaces
│   │       └── index.ts              Re-exports
│   │
│   └── module-sdk/           SDK every module author must use
│       └── src/
│           ├── manifest.ts           ManifestValidator (JSON Schema validation)
│           ├── lifecycle.ts          ModuleLifecycleHandler abstract class
│           ├── permissions.ts        PermissionRegistry
│           ├── events.ts             EventPublisher / EventSubscriber interfaces
│           ├── routes.ts             RouteDefinition type
│           ├── settings.ts           SettingsSchema type
│           └── index.ts              Re-exports
│
├── modules/
│   └── knowledge-base/       First-party reference module (proves SDK end-to-end)
│       ├── manifest.json             Machine-readable module manifest
│       ├── src/
│       │   ├── index.ts              ModuleLifecycleHandler implementation
│       │   ├── permissions.ts        KB permission registrations
│       │   ├── events.ts             KB versioned event definitions
│       │   ├── routes.ts             Hono routes for article CRUD
│       │   ├── runtime-types.ts      KB-internal types
│       │   ├── services/
│       │   │   └── article.service.ts  ArticleService (D1 CRUD)
│       │   └── migrations/
│       │       └── 0001_kb_articles.sql
│       └── tsconfig.json
│
├── docs/
│   ├── AGENTS.md             ← YOU ARE HERE
│   └── architecture/
│       ├── README.md                 Index of all architecture docs
│       ├── 01-executive-summary.md
│       ├── 02-requirements.md
│       ├── 03-c4-diagrams.md         Mermaid C4 diagrams
│       ├── 04-cloudflare-deployment.md
│       ├── 05-domain-model.md        ERD + domain boundaries
│       ├── 06-service-interfaces.md  TypeScript service contracts
│       ├── 07-module-manifest-schema.md  JSON Schema
│       ├── 08-module-sdk.md          SDK lifecycle docs
│       ├── 09-permission-model.md    RBAC design
│       ├── 10-event-schema.md        Event envelope + delivery rules
│       ├── 11-forms-workflow-schemas.md
│       ├── 12-content-model.md
│       ├── 13-marketplace-licensing.md
│       ├── 14-update-rollback.md
│       ├── 15-search-reporting-export.md
│       ├── 16-backup-recovery.md
│       ├── 17-threat-model.md        ← Read before any security-related work
│       ├── 18-accessibility-ux.md    ← Read before any UI work
│       ├── 19-design-tokens.md       ← Read before adding new CSS/styles
│       ├── 20-knowledge-base-spec.md
│       ├── 21-testing-cicd.md
│       ├── 22-cloudflare-limits.md   ← Read before using CF primitives
│       ├── 23-roadmap.md
│       ├── 24-backlog.md
│       └── adrs/                     Architecture Decision Records
│           ├── ADR-001-modular-monolith.md
│           ├── ADR-002-cloudflare-native.md
│           ├── ADR-003-d1-database.md
│           ├── ADR-004-centralized-auth.md
│           ├── ADR-005-module-manifest.md
│           ├── ADR-006-event-bus.md
│           ├── ADR-007-forms-engine.md
│           ├── ADR-008-workflow-engine.md
│           ├── ADR-009-content-engine.md
│           └── ADR-010-rbac-deny-by-default.md
│
├── .github/workflows/ci.yml  GitHub Actions: typecheck → lint → test → build
├── package.json              Monorepo root (pnpm workspaces + Turborepo scripts)
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json        Strict TypeScript base — all packages extend this
├── .eslintrc.cjs
├── .prettierrc
└── .nvmrc                    Node 20
```

---

## 3. Commands

Run all commands from the **repository root** unless noted.

| Purpose | Command |
|---|---|
| Install deps | `corepack pnpm install` |
| Dev (all apps) | `corepack pnpm dev` |
| Build all | `corepack pnpm build` |
| Test all | `corepack pnpm -r run test` |
| Typecheck all | `corepack pnpm -r run typecheck` |
| Lint all | `corepack pnpm -r run lint` |
| Format | `corepack pnpm format` |
| Worker dev server | `cd apps/worker && npx wrangler dev` |
| Web dev server | `cd apps/web && pnpm dev` |
| Run D1 migrations (local) | `cd apps/worker && npx wrangler d1 migrations apply community_platform_os --local` |
| Run a single test file | `cd <package> && npx vitest run src/__tests__/<file>` |

> **Always** run `pnpm typecheck && pnpm lint && pnpm test` after any code change before
> committing. Do not commit red CI.

---

## 4. Architectural Rules — Non-Negotiable

These constraints come from the original product brief and must never be violated:

### 4.1 Identity and Auth
- All authentication goes through `apps/worker/src/services/identity.ts`.
- Password hashing uses **PBKDF2 via Web Crypto API** (`SubtleCrypto`). Never use bcrypt,
  argon2, or Node's `crypto` module — they are not available in Cloudflare Workers.
- The **owner account** (`role: 'owner'`) cannot be deleted, demoted, disabled, or locked
  out by any module or normal admin operation. Enforce this in the identity service.
- Sessions are stored in D1. Cookie name comes from `env.SESSION_COOKIE_NAME` or defaults
  to `cf_session`.
- Modules must **never** create their own session stores, password fields, or auth flows.

### 4.2 RBAC and Permissions
- All permissions are registered in the core catalog at module install time.
- Authorization is server-side, deny-by-default. No client-side permission checks are
  authoritative.
- Modules register permissions via `PermissionRegistry` from `packages/module-sdk`.
- Permission keys follow the pattern `<module-id>.<resource>.<action>`, e.g.
  `knowledge-base.article.publish`.
- Never hard-code a permission check by string in multiple places — use the catalog.

### 4.3 Platform Service Interfaces
- **All** access to D1, R2, KV, Queues goes through the typed service interfaces defined
  in `packages/core-types/src/services.ts`.
- Modules receive services via dependency injection from the lifecycle handler — they do
  **not** import Cloudflare bindings directly.
- The `EnvBindings` type in `apps/worker/src/types.ts` is the only place raw bindings are
  allowed; they must be wrapped before being passed to services or modules.

### 4.4 Event Bus
- All cross-domain communication uses versioned events through `EventBus`
  (`apps/worker/src/services/event-bus.ts`).
- Event names follow the pattern `<domain>.<entity>.<verb>.v<N>`, e.g.
  `knowledge-base.article.published.v1`.
- Increment the version suffix (`v2`, `v3`) when the payload shape changes in a
  breaking way.
- Never subscribe to another module's internal implementation — only public events.
- Event payloads must **never** contain passwords, raw tokens, raw card data, or full
  PII beyond what is minimally necessary. Scrub before publishing.

### 4.5 Module Rules
- Every module must have a valid `manifest.json` conforming to the JSON Schema in
  `docs/architecture/07-module-manifest-schema.md`.
- Module lifecycle is: validate → install → activate → deactivate → update → rollback →
  uninstall → purge.
- Deactivation disables routes and jobs but retains code, settings, and user data.
- Uninstall removes active code and routes but preserves user-created data by default.
- Purge is a separate, owner-authorized operation that permanently removes data.
- A faulty module must never crash unrelated modules or the core platform.
- Modules cannot access another module's private D1 tables or R2 keys.

### 4.6 Database — D1 (SQLite)
- All schema changes go into numbered migration files in
  `apps/worker/src/db/migrations/` using the pattern `NNNN_description.sql`.
- Core migrations are `0001–0010`. New core migrations continue from `0011`.
- Module migrations live in `modules/<id>/src/migrations/`.
- Migration filenames are immutable once merged — never edit an existing migration file.
  Add a new one instead.
- Use SQLite-compatible SQL only — no PostgreSQL-specific syntax, no JSON operators not
  supported by D1.
- Always test migrations locally with `wrangler d1 migrations apply --local` before
  proposing to merge.

### 4.7 Security
- Study `docs/architecture/17-threat-model.md` before any security-adjacent change.
- Rate limiting, CSRF protection, and input validation are the responsibility of the
  worker routes — not the UI.
- Never commit secrets, API keys, tokens, or connection strings to the repository.
  Use Wrangler secrets (`wrangler secret put`) or `.dev.vars` (gitignored) for local dev.
- CSV exports must sanitize cell values to prevent formula injection
  (prefix `=`, `+`, `-`, `@` with a tab).
- Search results must be permission-filtered — never return records the actor cannot read.

### 4.8 Accessibility and UI
- Study `docs/architecture/18-accessibility-ux.md` before any UI change.
- All interactive elements must be keyboard-navigable with a visible `:focus-visible` ring.
- All form inputs require an associated `<label>` and inline error/hint text.
- Color contrast must meet WCAG 2.2 AA (4.5:1 text, 3:1 UI).
- Design tokens (colors, spacing, typography, motion) live in
  `apps/web/src/design-tokens.css` as CSS custom properties — **do not hard-code values**.
- Never suppress `prefers-reduced-motion` — respect it for all transitions and animations.

### 4.9 API Versioning
- All public API routes are prefixed `/api/v1/`.
- When a breaking change is needed, add a `/api/v2/` route; do not modify `/api/v1/`.
- API response shapes must remain backward-compatible within a version.

---

## 5. How to Add a New Feature

### Core feature (inside `apps/worker` or `packages/`)

1. Read the relevant architecture doc(s) first.
2. If a new D1 table is needed, create a new migration file `NNNN_description.sql`.
3. Add or extend types in `packages/core-types/src/`.
4. Implement in `apps/worker/src/` using existing service patterns.
5. Add a route in `apps/worker/src/routes/` and register it in `index.ts`.
6. Write a Vitest test in `apps/worker/src/__tests__/`.
7. If the feature emits events, define them following the naming convention in §4.4.
8. Write an audit entry via `AuditService` for any privileged action.
9. Run `pnpm typecheck && pnpm lint && pnpm test`.

### New module

1. Copy `modules/knowledge-base/` as a template.
2. Update `manifest.json` — give the module a unique `id` and update all fields.
3. Validate the manifest: `node -e "const {ManifestValidator}=require('./packages/module-sdk/dist'); ..."`.
4. Register permissions via `PermissionRegistry` in `src/permissions.ts`.
5. Define events in `src/events.ts` following the versioned naming convention.
6. Add D1 migrations in `src/migrations/`.
7. Implement routes in `src/routes.ts` using Hono — receive services via constructor/DI.
8. Register the module in `apps/worker/src/index.ts`.
9. Write tests.
10. Run `pnpm typecheck && pnpm lint && pnpm test`.

### UI change

1. Read `docs/architecture/18-accessibility-ux.md` and `19-design-tokens.md`.
2. Use token values from `apps/web/src/design-tokens.css` — never hard-code colors or spacing.
3. Reuse existing `Button`, `Input`, `PublicLayout`, `AppLayout` components.
4. New UI primitives go in `apps/web/src/components/ui/`.
5. New pages go in `apps/web/src/pages/` and are registered in `App.tsx`.
6. Verify keyboard navigation and focus states manually or with an accessibility tool.

---

## 6. What NOT to Do

These are hard rules — do not propose workarounds:

- ❌ Do not bypass the central auth service. No module-local sessions.
- ❌ Do not allow modules to import Cloudflare bindings directly (D1, R2, KV, Queues).
- ❌ Do not use bcrypt, argon2, or Node `crypto` — use SubtleCrypto (PBKDF2/HKDF/ECDSA).
- ❌ Do not delete, demote, or lock out the owner account.
- ❌ Do not add `any` TypeScript types without a comment explaining why.
- ❌ Do not edit existing D1 migration files. Add new ones.
- ❌ Do not hard-code CSS values — use design tokens.
- ❌ Do not store secrets in source code or environment variables committed to git.
- ❌ Do not promise Cloudflare features without verifying current limits/availability
  (see `docs/architecture/22-cloudflare-limits.md`).
- ❌ Do not add new dependencies without checking the GitHub Advisory Database first.
- ❌ Do not introduce microservices, Kubernetes, or distributed infrastructure.
- ❌ Do not create a new module that reimplements auth, RBAC, sessions, or audit logging.

---

## 7. CI Pipeline

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request:

```
pnpm install → typecheck → lint → test → build
```

All steps must pass on `main`/`master`. If CI fails, investigate using the GitHub Actions
MCP tools before making further changes.

---

## 8. Domain Boundaries

```
core (apps/worker, packages/)
  └── identity / auth / rbac       no module may replace these
  └── event-bus                    modules subscribe/publish via SDK interfaces
  └── audit                        every privileged action writes here
  └── forms engine                 modules define form templates
  └── workflow engine              modules define workflow definitions
  └── content engine               modules extend content types
  └── module manager               manages manifests, lifecycle, isolation

modules/ (knowledge-base, future modules)
  └── may NOT: import CF bindings, access other modules' tables,
               create sessions, manage their own auth, or define global roles
  └── may:     register permissions, publish/subscribe events,
               define routes, run migrations, register settings/widgets
```

Cross-module communication must go through:
1. Published events (async, decoupled)
2. Core platform services (sync, controlled)
3. Public API routes (HTTP, versioned)

Never import directly from another module's `src/`.

---

## 9. Roadmap Context

| Phase | Focus |
|---|---|
| **MVP** (current) | Owner bootstrap, session auth, module manifest validation, KB CRUD scaffold |
| **V1** | RBAC UI, audit viewer, content publish workflow, permission-aware search |
| **V2** | Forms engine UI + workflow bindings, marketplace checkout, entitlements, backups |
| **V3** | External identity federation (SSO), advanced exports, multi-module governance |

When implementing a feature, check `docs/architecture/24-backlog.md` for acceptance
criteria and `docs/architecture/23-roadmap.md` for phase context. Do not implement V2/V3
features during MVP/V1 work unless explicitly instructed.

---

## 10. Key Architecture Documents by Task Type

| Task type | Read first |
|---|---|
| Any change | This file + `docs/architecture/README.md` |
| Auth / identity | `docs/architecture/04-centralized-auth.md` (ADR) + `09-permission-model.md` |
| New API route | `docs/architecture/06-service-interfaces.md` + `09-permission-model.md` |
| New module | `docs/architecture/07-module-manifest-schema.md` + `08-module-sdk.md` |
| Database schema | `docs/architecture/05-domain-model.md` + `ADR-003-d1-database.md` |
| Events | `docs/architecture/10-event-schema.md` + `ADR-006-event-bus.md` |
| Forms | `docs/architecture/11-forms-workflow-schemas.md` + `ADR-007-forms-engine.md` |
| Workflows | `docs/architecture/11-forms-workflow-schemas.md` + `ADR-008-workflow-engine.md` |
| Content | `docs/architecture/12-content-model.md` + `ADR-009-content-engine.md` |
| Marketplace / billing | `docs/architecture/13-marketplace-licensing.md` |
| Updates / versioning | `docs/architecture/14-update-rollback.md` |
| Search / export | `docs/architecture/15-search-reporting-export.md` |
| Backup / recovery | `docs/architecture/16-backup-recovery.md` |
| Security work | `docs/architecture/17-threat-model.md` |
| UI / components | `docs/architecture/18-accessibility-ux.md` + `19-design-tokens.md` |
| Cloudflare limits | `docs/architecture/22-cloudflare-limits.md` |
