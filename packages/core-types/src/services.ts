import type { AuthenticatedSession, User } from './index';

export interface LoginInput {
  installationId: string;
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface OwnerBootstrapInput {
  installationId: string;
  email: string;
  password: string;
  displayName: string;
}

export interface IdentityProvider {
  authenticate(input: LoginInput): Promise<AuthenticatedSession | null>;
  bootstrapOwner(input: OwnerBootstrapInput): Promise<User>;
  getSession(sessionToken: string): Promise<AuthenticatedSession | null>;
}
