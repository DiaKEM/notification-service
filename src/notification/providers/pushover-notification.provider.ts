import { Injectable } from '@nestjs/common';
import { NotificationPriority } from '../../job-configuration/job-configuration.schema';
import {
  PushoverPriority,
  PushoverService,
} from '../../pushover/pushover.service';
import { NotificationProvider } from '../notification.decorator';
import {
  Notification,
  NotificationProviderBase,
} from '../notification-provider-base';

const PRIORITY_MAP: Record<NotificationPriority, PushoverPriority> = {
  [NotificationPriority.LOW]: PushoverPriority.Low,
  [NotificationPriority.MID]: PushoverPriority.Normal,
  [NotificationPriority.HIGH]: PushoverPriority.High,
  [NotificationPriority.URGENT]: PushoverPriority.Emergency,
};

@Injectable()
@NotificationProvider('pushover')
export class PushoverNotificationProvider extends NotificationProviderBase {
  constructor(private readonly pushover: PushoverService) {
    super();
  }

  async send(notification: Notification): Promise<void> {
    await this.pushover.sendMessage({
      message: notification.message,
      title: notification.title,
      priority: PRIORITY_MAP[notification.priority],
    });
  }
}
