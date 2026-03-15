import { NotificationProviderBase } from './notification-provider-base';
import {
  NotificationProviderKey,
  NOTIFICATION_PROVIDER_STORE,
} from './notification-provider.registry';

export function NotificationProvider(key: NotificationProviderKey): ClassDecorator {
  return (target: Function) => {
    NOTIFICATION_PROVIDER_STORE.set(key, target as typeof NotificationProviderBase);
  };
}
