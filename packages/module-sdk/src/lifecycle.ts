
import type { EventService, ModuleManifest, NotificationService } from '@community-os/core-types';

export interface LifecycleServices {
  eventService: EventService;
  notificationService: NotificationService;
}

export interface ModuleLifecycleContext {
  installationId: string;
  actorId: string;
  now: string;
  services: LifecycleServices;
}

export abstract class ModuleLifecycleHandler {
  public abstract readonly manifest: ModuleManifest;

  public async validate(_context: ModuleLifecycleContext): Promise<void> {}

  public abstract install(context: ModuleLifecycleContext): Promise<void>;

  public abstract activate(context: ModuleLifecycleContext): Promise<void>;

  public async deactivate(_context: ModuleLifecycleContext): Promise<void> {}

  public abstract update(context: ModuleLifecycleContext, previousVersion: string): Promise<void>;

  public abstract rollback(context: ModuleLifecycleContext, failedVersion: string): Promise<void>;

  public abstract uninstall(context: ModuleLifecycleContext): Promise<void>;

  public async purge(_context: ModuleLifecycleContext): Promise<void> {}
}
