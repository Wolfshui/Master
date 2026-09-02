export * from './audit';
export * from './content';
export * from './entitlement';
export * from './event';
export * from './form';
export * from './module';
export * from './services';
export * from './user';
export * from './workflow';

export interface D1RunResult {
  success: boolean;
  meta?: Record<string, unknown>;
}

export interface D1AllResult<T> {
  results: T[];
}

export interface D1Statement {
  bind(...values: readonly unknown[]): D1Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<D1AllResult<T>>;
  run(): Promise<D1RunResult>;
}

export interface D1Database {
  prepare(query: string): D1Statement;
  exec(query: string): Promise<unknown>;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthenticatedSession {
  user: User;
  sessionToken: string;
}
