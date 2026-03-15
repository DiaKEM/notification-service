import { Module } from '@nestjs/common';
import { PushoverModule } from '../pushover/pushover.module';
import { TelegramModule } from '../telegram/telegram.module';
import { NotificationProviderRegistryService } from './notification-provider-registry.service';
import { PushoverNotificationProvider } from './providers/pushover-notification.provider';
import { TelegramNotificationProvider } from './providers/telegram-notification.provider';

@Module({
  imports: [PushoverModule, TelegramModule],
  providers: [
    NotificationProviderRegistryService,
    PushoverNotificationProvider,
    TelegramNotificationProvider,
  ],
  exports: [NotificationProviderRegistryService],
})
export class NotificationModule {}
