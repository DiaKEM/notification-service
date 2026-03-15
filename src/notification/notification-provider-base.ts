import { NotificationPriority } from '../job-configuration/job-configuration.schema';

export interface Notification {
  title?: string;
  message: string;
  priority: NotificationPriority;
}

export abstract class NotificationProviderBase {
  abstract send(notification: Notification): Promise<void>;
}
