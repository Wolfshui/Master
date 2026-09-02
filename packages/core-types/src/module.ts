export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  repository?: string;
  status: 'active' | 'inactive' | 'error';
  installationId: string;
  installedAt: string;
  updatedAt: string;
}
