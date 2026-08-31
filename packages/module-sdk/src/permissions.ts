
import type { ModulePermissionDeclaration } from '@community-os/core-types';

export class PermissionRegistry {
  private readonly permissions = new Map<string, ModulePermissionDeclaration>();

  public register(permission: ModulePermissionDeclaration): void {
    if (this.permissions.has(permission.key)) {
      throw new Error(`Permission already registered: ${permission.key}`);
    }

    this.permissions.set(permission.key, permission);
  }

  public registerMany(permissions: readonly ModulePermissionDeclaration[]): void {
    for (const permission of permissions) {
      this.register(permission);
    }
  }

  public has(permissionKey: string): boolean {
    return this.permissions.has(permissionKey);
  }

  public list(): readonly ModulePermissionDeclaration[] {
    return Array.from(this.permissions.values());
  }
}
