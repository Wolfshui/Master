export class ArticleService {
    db;
    installationId;
    constructor(db, installationId) {
        this.db = db;
        this.installationId = installationId;
    }
    async list() {
        const rows = await this.db
            .prepare(`SELECT id, installation_id, title, slug, summary, category, body_markdown, locale, status, discoverable, created_by, updated_by, created_at, updated_at
         FROM kb_articles WHERE installation_id = ? ORDER BY updated_at DESC`)
            .bind(this.installationId)
            .all();
        return rows.results.map((row) => this.toRecord(row));
    }
    async getById(id) {
        const row = await this.db
            .prepare(`SELECT id, installation_id, title, slug, summary, category, body_markdown, locale, status, discoverable, created_by, updated_by, created_at, updated_at
         FROM kb_articles WHERE installation_id = ? AND id = ?`)
            .bind(this.installationId, id)
            .first();
        return row ? this.toRecord(row) : null;
    }
    async create(input) {
        const now = new Date().toISOString();
        const article = {
            id: crypto.randomUUID(),
            installationId: this.installationId,
            createdAt: now,
            updatedAt: now,
            ...input,
        };
        await this.db
            .prepare(`INSERT INTO kb_articles (id, installation_id, title, slug, summary, category, body_markdown, locale, status, discoverable, created_by, updated_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .bind(article.id, article.installationId, article.title, article.slug, article.summary, article.category, article.bodyMarkdown, article.locale, article.status, article.discoverable ? 1 : 0, article.createdBy, article.updatedBy, article.createdAt, article.updatedAt)
            .run();
        return article;
    }
    async update(id, input) {
        const current = await this.getById(id);
        if (!current) {
            return null;
        }
        const next = {
            ...current,
            ...input,
            id: current.id,
            installationId: current.installationId,
            createdAt: current.createdAt,
            updatedAt: new Date().toISOString(),
        };
        await this.db
            .prepare(`UPDATE kb_articles
         SET title = ?, slug = ?, summary = ?, category = ?, body_markdown = ?, locale = ?, status = ?, discoverable = ?, updated_by = ?, updated_at = ?
         WHERE installation_id = ? AND id = ?`)
            .bind(next.title, next.slug, next.summary, next.category, next.bodyMarkdown, next.locale, next.status, next.discoverable ? 1 : 0, next.updatedBy, next.updatedAt, this.installationId, id)
            .run();
        return next;
    }
    async remove(id) {
        const current = await this.getById(id);
        if (!current) {
            return false;
        }
        await this.db.prepare('DELETE FROM kb_articles WHERE installation_id = ? AND id = ?').bind(this.installationId, id).run();
        return true;
    }
    toRecord(row) {
        return {
            id: row.id,
            installationId: row.installation_id,
            title: row.title,
            slug: row.slug,
            summary: row.summary,
            category: row.category,
            bodyMarkdown: row.body_markdown,
            locale: row.locale,
            status: row.status,
            discoverable: row.discoverable === 1,
            createdBy: row.created_by,
            updatedBy: row.updated_by,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}
