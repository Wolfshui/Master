interface Permission {
  key: string;
  [key: string]: unknown;
}

export class PermissionRegistry {
  private permissions = new Map<string, Permission>();

  register(permission: Permission): void {
    if (this.permissions.has(permission.key)) {
      throw new Error(`Permission already registered: ${permission.key}`);
    }
    this.permissions.set(permission.key, permission);
  }

  registerMany(permissions: Permission[]): void {
    for (const permission of permissions) {
      this.register(permission);
    }
  }

  has(permissionKey: string): boolean {
    return this.permissions.has(permissionKey);
  }

  list(): Permission[] {
    return Array.from(this.permissions.values());
  }
}
