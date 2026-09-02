
import type { AuthenticatedSession } from '@community-os/core-types';

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

export interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface EnvBindings {
  DB: D1Database;
  PLATFORM_CACHE: KVNamespace;
  INSTALLATION_ID?: string;
  SESSION_COOKIE_NAME?: string;
}

export interface AppVariables {
  auth: AuthenticatedSession | null;
}
