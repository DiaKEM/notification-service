import { NotificationProviderBase } from './notification-provider-base';

export type NotificationProviderKey = 'pushover' | 'telegram';

// Populated by @NotificationProvider() at class-definition time, before the DI container starts.
export const NOTIFICATION_PROVIDER_STORE = new Map<
  NotificationProviderKey,
  typeof NotificationProviderBase
>();
