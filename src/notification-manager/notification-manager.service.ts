import { Injectable, Logger } from '@nestjs/common';
import {
  NotificatorPayload,
  NotificatorProviderBase,
} from '../notificator/notificator-provider-base';
import { NotificatorProviderRegistryService } from '../notificator/notificator-provider-registry.service';

@Injectable()
export class NotificationManagerService extends NotificatorProviderBase {
  private readonly logger = new Logger(NotificationManagerService.name);

  constructor(private readonly registry: NotificatorProviderRegistryService) {
    super();
  }

  async send(payload: NotificatorPayload): Promise<void> {
    const keys = this.registry.getRegisteredKeys();
    await Promise.all(
      keys.map(async (key) => {
        try {
          await this.registry.resolve(key).send(payload);
          this.logger.log(`Notification sent via "${key}"`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          this.logger.error(`Provider "${key}" failed: ${message}`);
        }
      }),
    );
  }
}
