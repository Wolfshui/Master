
# Knowledge Base Module Specification

## Domain model

The knowledge-base module is a specialization of the shared content engine. Each article is a `ContentItem` with knowledge-specific metadata: summary, category, tags, discoverability, review cadence, and related article links.

## API endpoints

- `GET /api/v1/kb/articles` – list articles with permission-aware filtering
- `POST /api/v1/kb/articles` – create draft article
- `GET /api/v1/kb/articles/:id` – fetch single article
- `PUT /api/v1/kb/articles/:id` – update article metadata or draft body
- `DELETE /api/v1/kb/articles/:id` – soft-delete or archive article

## Manifest requirements

- declares read/write/publish/manage permissions
- publishes create, update, publish, and delete events
- registers lifecycle hooks and migrations
- declares settings for default category taxonomy and review reminders

## Permissions

- `knowledge-base.article.read`
- `knowledge-base.article.write`
- `knowledge-base.article.publish`
- `knowledge-base.article.manage`

## Events

- `knowledge-base.article.created.v1`
- `knowledge-base.article.updated.v1`
- `knowledge-base.article.published.v1`
- `knowledge-base.article.deleted.v1`

## Workflow

Draft → Review → Published → Archived. Publish requires the publish permission; archive requires manage.

## Wireframe descriptions

- **Article list:** search field, status chips, category filters, create button.
- **Editor:** title, slug, summary, category, body, review cadence, save/publish actions.
- **Reader view:** breadcrumbs, title, summary, metadata strip, article body, related articles.
