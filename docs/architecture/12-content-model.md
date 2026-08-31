
# Content Model

Content is modeled as a base `ContentItem` with specialized overlays such as `KBArticle`. Revisions are immutable snapshots linked back to the canonical item.

## Type hierarchy

- `ContentItem` – installation-scoped root entity containing slug, locale, status, authoring metadata, and workflow linkage.
- `ContentRevision` – revision payload, publish metadata, and checksum.
- `KBArticle` – knowledge-base specialization for summary, category, and discoverability.

## Localization readiness

- `ContentItem.locale` stores the language tag of the canonical item.
- Future translations use `translationGroupId` with one `ContentItem` per locale.
- Slugs are unique per installation and locale.
- Search indexes store locale-aware analyzers and fallbacks.

## Status model

Draft, review, scheduled, published, archived, and retired states are supported so workflows can safely gate publication and rollback.
