# Community Platform OS

A self-hosted, Cloudflare-native modular platform for small organizations — conventions,
gaming groups, nonprofits, clubs, event spaces, and independent creators. Install only the
capabilities you need. No developers required.

---

## What It Is

Community Platform OS is a modular operating system inspired by WordPress and its plugin
ecosystem, built entirely on Cloudflare's serverless stack. Each installation serves one
organization. Modules extend the platform without modifying the core. The platform handles
identity, access control, forms, workflows, content, events, search, audit, and licensing
centrally so every module inherits those capabilities automatically.

**Current status:** Architecture package complete, MVP vertical slice in progress.
First-party Knowledge Base module proves the Module SDK end-to-end.

---

## Architecture at a Glance

```
┌──────────────────────────────────────────────────────┐
│                  apps/web  (React 19 + Vite)         │
│  Login · Setup · Dashboard · Module UIs · Design System │
└─────────────────────────┬────────────────────────────┘
                          │ /api/v1/*
┌─────────────────────────▼────────────────────────────┐
│              apps/worker  (Hono on CF Workers)        │
│  Auth  ·  RBAC  ·  Modules  ·  Events  ·  Audit      │
│  Forms  ·  Workflow  ·  Content  ·  Search  ·  Health │
└────┬───────────┬──────────────┬────────────┬──────────┘
     │           │              │            │
    D1         R2              KV          Queues
  (SQLite)  (Uploads/       (Cache/      (Async jobs /
             Packages/       Config)      Event delivery)
             Backups)
```

**Packages:**
- `packages/core-types` — shared TypeScript types and all platform service interfaces
- `packages/module-sdk` — manifest validator, lifecycle handler, permission registry, event interfaces

**Modules:**
- `modules/knowledge-base` — first-party reference module (articles, categories, tags, CRUD, events)

**Architecture docs:** [`docs/architecture/`](docs/architecture/README.md) — 24 specification
documents + 10 Architecture Decision Records covering every subsystem.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Cloudflare Workers |
| API framework | [Hono](https://hono.dev) |
| Database | Cloudflare D1 (SQLite) |
| Object storage | Cloudflare R2 |
| Cache | Cloudflare Workers KV |
| Async processing | Cloudflare Queues |
| UI | React 19 + Vite + TailwindCSS v4 |
| Language | TypeScript 5 (strict) |
| Package manager | pnpm 10 (workspaces) |
| Build pipeline | Turborepo 2 |
| Tests | Vitest 3 |
| Infra / deploy | Wrangler 4 |
| Node version | 20 (see `.nvmrc`) |
| CI | GitHub Actions |

---

## Repository Structure

```
/
├── apps/
│   ├── web/          React SPA — UI shell, pages, design system
│   └── worker/       Cloudflare Worker — API, services, migrations
├── packages/
│   ├── core-types/   Shared types + service interfaces
│   └── module-sdk/   SDK every module author uses
├── modules/
│   └── knowledge-base/  First-party reference module
└── docs/
    ├── AGENTS.md          AI agent project map and working instructions
    └── architecture/      Full architecture documentation (24 docs + 10 ADRs)
```

---

## Getting Started

### Prerequisites

- Node.js 20 (`nvm use` or see `.nvmrc`)
- pnpm 10: `npm i -g corepack && corepack enable`
- A Cloudflare account with Workers, D1, R2, KV, and Queues enabled (for deployment)

### Local development

```bash
# Install all workspace dependencies
corepack pnpm install

# Start all apps in watch mode
corepack pnpm dev

# Worker only (Wrangler dev server with local D1)
cd apps/worker
npx wrangler dev

# Web only (Vite)
cd apps/web
pnpm dev
```

### Apply D1 migrations locally

```bash
cd apps/worker
npx wrangler d1 migrations apply community_platform_os --local
```

### Run checks

```bash
# From repo root:
corepack pnpm typecheck   # TypeScript type check (all packages)
corepack pnpm lint        # ESLint (all packages)
corepack pnpm test        # Vitest (all packages)
corepack pnpm build       # Production build (all packages)
corepack pnpm format      # Prettier formatting
```

---

## Core Principles

- **Centralized identity** — one auth system for the core and every module; modules cannot
  create their own session stores or password fields
- **Deny by default** — all permissions are explicitly granted; no implicit access
- **Owner protection** — the owner account cannot be deleted, demoted, or locked out by
  any module or admin operation
- **Module isolation** — modules register capabilities through the SDK; they cannot import
  another module's private code or data
- **Service interfaces** — modules access D1, R2, KV, and Queues through typed platform
  interfaces, never Cloudflare bindings directly
- **Versioned events** — cross-domain communication uses the event bus with versioned
  names (`knowledge-base.article.published.v1`) and a typed envelope
- **Audit everything** — every privileged action writes a structured audit entry
- **WCAG 2.2 AA** — all UI components meet accessibility standards by default
- **No secrets in source** — use Wrangler secrets or `.dev.vars` for local development

---

## Cloudflare Bindings (wrangler.toml)

| Binding | Type | Purpose |
|---|---|---|
| `DB` | D1 | Primary relational database (SQLite) |
| `MODULE_ASSETS` | R2 | Module packages, uploads, backups |
| `PLATFORM_CACHE` | KV | Non-authoritative config cache |
| `EVENT_QUEUE` | Queue | Async event delivery |

---

## Authentication

- Email + password (PBKDF2 via Web Crypto API)
- Email verification (planned)
- Passwordless email links (V1)
- Passkeys / WebAuthn (V1)
- Optional MFA (V1)
- Google, Apple, Microsoft, Discord OAuth (V1/V2)
- Session and device management
- Rate limiting on all auth endpoints

**API endpoints:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/auth/setup` | Bootstrap first owner account |
| `POST` | `/api/v1/auth/login` | Email + password login |
| `POST` | `/api/v1/auth/logout` | Revoke current session |
| `GET` | `/api/v1/auth/session` | Get current session |

---

## Module System

Modules are versioned, signed packages with a machine-readable `manifest.json`.
The manifest declares the module's ID, permissions, routes, events, migrations,
settings schema, and lifecycle handlers.

**Lifecycle:** validate → install → activate → deactivate → update → rollback → uninstall → purge

Deactivation disables routes and jobs but retains code, settings, and user data.
Uninstallation removes active code but preserves user-created data by default.
Purge is a separate, owner-authorized operation.

See [`docs/architecture/07-module-manifest-schema.md`](docs/architecture/07-module-manifest-schema.md)
and [`docs/architecture/08-module-sdk.md`](docs/architecture/08-module-sdk.md).

---

## Knowledge Base Module

The Knowledge Base is the first-party reference module. It proves the Module SDK
end-to-end and serves as the template for all future modules.

**Permissions:** `knowledge-base.article.{read,write,publish,manage}`

**Events:** `knowledge-base.article.{created,updated,deleted}.v1`

**Routes:** `GET/POST /api/v1/kb/articles`, `GET/PUT/DELETE /api/v1/kb/articles/:id`

---

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| **MVP** | Owner bootstrap · session auth · module manifest validation · KB CRUD | 🔄 In progress |
| **V1** | RBAC management UI · audit viewer · content publish workflow · search | 📋 Planned |
| **V2** | Forms engine UI · workflow bindings · marketplace checkout · backups | 📋 Planned |
| **V3** | SSO federation · advanced exports · multi-module governance | 📋 Planned |

Full roadmap: [`docs/architecture/23-roadmap.md`](docs/architecture/23-roadmap.md)
Prioritized backlog: [`docs/architecture/24-backlog.md`](docs/architecture/24-backlog.md)

---

## Documentation

| Document | Description |
|---|---|
| [`docs/AGENTS.md`](docs/AGENTS.md) | AI agent project map and working instructions |
| [`docs/architecture/README.md`](docs/architecture/README.md) | Architecture docs index |
| [`docs/architecture/01-executive-summary.md`](docs/architecture/01-executive-summary.md) | Product vision and non-goals |
| [`docs/architecture/17-threat-model.md`](docs/architecture/17-threat-model.md) | Security threat model |
| [`docs/architecture/18-accessibility-ux.md`](docs/architecture/18-accessibility-ux.md) | WCAG 2.2 AA + UX requirements |
| [`docs/architecture/22-cloudflare-limits.md`](docs/architecture/22-cloudflare-limits.md) | CF limits, costs, portability |
| [`docs/architecture/adrs/`](docs/architecture/adrs/) | Architecture Decision Records |

---

## Contributing and AI Agents

If you are an AI agent working on this repository, read
[`docs/AGENTS.md`](docs/AGENTS.md) before making any changes.
It contains the complete project map, architectural rules, naming conventions,
prohibited actions, and step-by-step guides for every type of change.

Human contributors should follow the same document as the primary working guide.
