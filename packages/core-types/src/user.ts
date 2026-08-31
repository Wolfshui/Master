
export type UserStatus = 'active' | 'invited' | 'disabled';
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'publish' | 'install';

export interface Installation {
  id: string;
  slug: string;
  name: string;
  status: 'provisioning' | 'active' | 'suspended';
  createdAt: string;
}

export interface Permission {
  id: string;
  key: string;
  resource: string;
  action: PermissionAction;
  description: string;
  assignable: boolean;
  isSystem: boolean;
}

export interface Role {
  id: string;
  installationId: string;
  name: string;
  description: string;
  permissionKeys: readonly string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  installationId: string;
  email: string;
  displayName: string;
  status: UserStatus;
  isOwner: boolean;
  roleIds: readonly string[];
  permissionKeys: readonly string[];
  createdAt: string;
  updatedAt: string;
}

export interface OwnerProfile {
  bootstrapCompletedAt: string;
  protectedPermissions: readonly string[];
}

export interface Session {
  id: string;
  installationId: string;
  userId: string;
  expiresAt: string;
  issuedAt: string;
  lastSeenAt: string;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}

export interface OwnerBootstrapInput {
  installationId: string;
  email: string;
  password: string;
  displayName: string;
}

export interface LoginInput {
  installationId: string;
  email: string;
  password: string;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}

export interface AuthenticatedSession {
  sessionToken: string;
  session: Session;
  user: User;
}
