export class PermissionRegistry {
    permissions = new Map();
    register(permission) {
        if (this.permissions.has(permission.key)) {
            throw new Error(`Permission already registered: ${permission.key}`);
        }
        this.permissions.set(permission.key, permission);
    }
    registerMany(permissions) {
        for (const permission of permissions) {
            this.register(permission);
        }
    }
    has(permissionKey) {
        return this.permissions.has(permissionKey);
    }
    list() {
        return Array.from(this.permissions.values());
    }
}
