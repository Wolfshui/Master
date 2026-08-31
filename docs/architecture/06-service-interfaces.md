
# Service Interfaces

Core services are expressed as TypeScript interfaces so runtime code and modules remain portable. Cloudflare-specific implementations live at the worker layer.

```ts
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

export interface SearchService {
  index(document: SearchDocument): Promise<void>;
  remove(documentId: string): Promise<void>;
  search(query: SearchQuery): Promise<SearchResultPage>;
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

export interface PaymentProvider {
  createCheckoutSession(input: CheckoutRequest): Promise<CheckoutSession>;
  parseWebhook(payload: string, signature?: string): Promise<PaymentEvent>;
}

export interface LicenseProvider {
  issueLicense(input: LicenseIssueRequest): Promise<LicenseKey>;
  validateLicense(key: string): Promise<Entitlement | null>;
}
```

## Design notes

- Interfaces are intentionally coarse-grained to reduce chatty edge/database traffic.
- Module code depends on these contracts, not raw Cloudflare bindings.
- Search and notification remain async-friendly so implementations can batch or queue operations.
