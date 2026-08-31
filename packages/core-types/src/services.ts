
import type { AuditEntry } from './audit';
import type { Entitlement, LicenseKey } from './entitlement';
import type { EventEnvelope } from './event';
import type { LoginInput, AuthenticatedSession, OwnerBootstrapInput, User } from './user';

export interface DataService {
  getById<T>(table: string, id: string): Promise<T | null>;
  query<T>(statement: string, bindings?: readonly unknown[]): Promise<readonly T[]>;
  execute(statement: string, bindings?: readonly unknown[]): Promise<void>;
  transaction<T>(work: (dataService: DataService) => Promise<T>): Promise<T>;
}

export interface ObjectStorageService {
  put(key: string, value: ArrayBuffer | ReadableStream | string, metadata?: Record<string, string>): Promise<void>;
  get(key: string): Promise<ArrayBuffer | null>;
  delete(key: string): Promise<void>;
  signedDownloadUrl(key: string, ttlSeconds: number): Promise<string>;
}

export interface EventService {
  publish<TPayload extends Record<string, unknown>>(event: EventEnvelope<string, TPayload>): Promise<void>;
  publishBatch(events: readonly EventEnvelope[]): Promise<void>;
}

export interface QueueService<TMessage = Record<string, unknown>> {
  enqueue(message: TMessage): Promise<void>;
  enqueueBatch(messages: readonly TMessage[]): Promise<void>;
}

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface SearchDocument {
  id: string;
  installationId: string;
  title: string;
  body: string;
  locale: string;
  permissionKeys: readonly string[];
  tags?: readonly string[];
}

export interface SearchQuery {
  installationId: string;
  query: string;
  permissionKeys: readonly string[];
  locale?: string;
  limit?: number;
  cursor?: string;
}

export interface SearchResultPage {
  items: readonly SearchDocument[];
  nextCursor?: string;
  totalEstimate?: number;
}

export interface SearchService {
  index(document: SearchDocument): Promise<void>;
  remove(documentId: string): Promise<void>;
  search(query: SearchQuery): Promise<SearchResultPage>;
}

export interface NotificationCommand {
  channel: 'email' | 'webhook' | 'in_app';
  installationId: string;
  template: string;
  recipient: string;
  data: Record<string, string | number | boolean>;
}

export interface NotificationService {
  notify(command: NotificationCommand): Promise<void>;
}

export interface IdentityProvider {
  bootstrapOwner(input: OwnerBootstrapInput): Promise<User>;
  authenticate(input: LoginInput): Promise<AuthenticatedSession | null>;
  getSession(sessionToken: string): Promise<AuthenticatedSession | null>;
  invalidateSession(sessionToken: string): Promise<void>;
}

export interface CheckoutRequest {
  installationId: string;
  moduleId: string;
  purchaseType: Entitlement['purchaseType'];
  quantity?: number;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSession {
  id: string;
  checkoutUrl: string;
  expiresAt: string;
}

export interface PaymentEvent {
  id: string;
  type: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface PaymentProvider {
  createCheckoutSession(input: CheckoutRequest): Promise<CheckoutSession>;
  parseWebhook(payload: string, signature?: string): Promise<PaymentEvent>;
}

export interface LicenseIssueRequest {
  installationId: string;
  moduleId: string;
  purchaseType: Entitlement['purchaseType'];
  seats?: number;
  validUntil?: string;
}

export interface LicenseProvider {
  issueLicense(input: LicenseIssueRequest): Promise<LicenseKey>;
  validateLicense(key: string): Promise<Entitlement | null>;
}

export interface AuditWriter {
  write(entry: AuditEntry): Promise<void>;
}
