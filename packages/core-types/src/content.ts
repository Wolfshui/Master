
export type ContentStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived' | 'retired';

export interface ContentItem {
  id: string;
  installationId: string;
  type: 'article' | 'page' | 'asset' | 'faq';
  slug: string;
  title: string;
  locale: string;
  translationGroupId?: string;
  status: ContentStatus;
  latestRevisionNumber: number;
  workflowInstanceId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentRevision {
  id: string;
  contentItemId: string;
  revisionNumber: number;
  summary?: string;
  body: Record<string, unknown>;
  checksum: string;
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
}
