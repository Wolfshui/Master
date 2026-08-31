
# Accessibility and UX

## WCAG 2.2 AA requirements

- All interactive controls require visible labels and programmatic names.
- Focus indicators must meet contrast and area requirements.
- Color alone cannot communicate error or status.
- Keyboard-only users must reach setup, login, dashboard, and CRUD actions.
- Error summaries and inline field help must be announced to assistive tech.

## Responsive breakpoints

- `sm`: 40rem – stacked forms and condensed nav
- `md`: 48rem – two-column settings and dashboard cards
- `lg`: 64rem – full app shell with sidebar
- `xl`: 80rem – dense admin tables and multi-pane workflows

## UX principles

- setup and login prioritize clarity over density
- dangerous actions require explicit confirmation copy
- auditability is surfaced, not buried
- module pages show permission and entitlement state alongside feature controls

## Design token schema

A shared token schema defines color, spacing, typography, shape, and motion so Penpot, CSS, and React components consume the same values.
