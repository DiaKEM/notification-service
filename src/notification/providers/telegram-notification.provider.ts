import { Injectable } from '@nestjs/common';
import { NotificationPriority } from '../../job-configuration/job-configuration.schema';
import { TelegramService } from '../../telegram/telegram.service';
import { NotificationProvider } from '../notification.decorator';
import {
  Notification,
  NotificationProviderBase,
} from '../notification-provider-base';

const PRIORITY_PREFIX: Record<NotificationPriority, string> = {
  [NotificationPriority.LOW]: '🔵',
  [NotificationPriority.MID]: '🟡',
  [NotificationPriority.HIGH]: '🟠',
  [NotificationPriority.URGENT]: '🔴',
};

@Injectable()
@NotificationProvider('telegram')
export class TelegramNotificationProvider extends NotificationProviderBase {
  constructor(private readonly telegram: TelegramService) {
    super();
  }

  async send(notification: Notification): Promise<void> {
    const prefix = PRIORITY_PREFIX[notification.priority];
    const header = notification.title ? `*${notification.title}*\n` : '';
    await this.telegram.sendMessage(
      `${prefix} ${header}${notification.message}`,
    );
  }
}
