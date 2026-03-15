import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NotificationProviderBase } from './notification-provider-base';
import {
  NotificationProviderKey,
  NOTIFICATION_PROVIDER_STORE,
} from './notification-provider.registry';

@Injectable()
export class NotificationProviderRegistryService {
  constructor(private readonly moduleRef: ModuleRef) {}

  resolve(key: NotificationProviderKey): NotificationProviderBase {
    const cls = NOTIFICATION_PROVIDER_STORE.get(key);
    if (!cls) {
      throw new NotFoundException(
        `No notification provider registered for key: "${key}"`,
      );
    }
    return this.moduleRef.get(cls as Type<NotificationProviderBase>, {
      strict: false,
    });
  }

  getRegisteredKeys(): NotificationProviderKey[] {
    return Array.from(NOTIFICATION_PROVIDER_STORE.keys());
  }
}
