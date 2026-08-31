import type { AuthenticatedSession } from '@community-os/core-types';

export interface KnowledgeBaseD1AllResult<T> {
  results: T[];
}

export interface KnowledgeBaseD1Statement {
  bind(...values: readonly unknown[]): KnowledgeBaseD1Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<KnowledgeBaseD1AllResult<T>>;
  run(): Promise<unknown>;
}

export interface KnowledgeBaseD1Database {
  prepare(query: string): KnowledgeBaseD1Statement;
}

export interface KnowledgeBaseEventQueue {
  send(message: Record<string, unknown>): Promise<void>;
}

export interface KnowledgeBaseBindings {
  DB: KnowledgeBaseD1Database;
  EVENT_QUEUE: KnowledgeBaseEventQueue;
  INSTALLATION_ID?: string;
}

export interface KnowledgeBaseVariables {
  auth: AuthenticatedSession | null;
}

export type KnowledgeBaseAppEnv = {
  Bindings: KnowledgeBaseBindings;
  Variables: KnowledgeBaseVariables;
};
