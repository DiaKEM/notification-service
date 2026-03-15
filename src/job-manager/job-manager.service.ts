import { Injectable, Logger } from '@nestjs/common';
import { JobTypeRegistryService } from '../job-type/job-type-registry.service';
import { JobTypeKey } from '../job-type/job-type.registry';
import { JobExecutionService } from '../job-execution/job-execution.service';
import { NotificationManagerService } from '../notification-manager/notification-manager.service';

@Injectable()
export class JobManagerService {
  private readonly logger = new Logger(JobManagerService.name);

  constructor(
    private readonly jobTypeRegistry: JobTypeRegistryService,
    private readonly notificationManager: NotificationManagerService,
  ) {}

  async runAll(): Promise<void> {
    const keys = this.jobTypeRegistry.getRegisteredKeys();
    this.logger.log(`Running all job types: ${keys.join(', ')}`);
    await Promise.all(keys.map((key) => this.run(key)));
  }

  async run(key: JobTypeKey): Promise<void> {
    const job = this.jobTypeRegistry.resolve(key);
    try {
      const ctx = await job.execute();
      this.logger.log(
        `Job "${key}" completed with status "${ctx.document.status}" — ${ctx.document.logs.length} log(s)`,
      );

      if (!ctx.document.needsNotification) {
        this.logger.log(`Job "${key}" did not need notification`);
        return;
      }

      const jobConfiguration = ctx.document.jobConfiguration;
      if (!jobConfiguration) {
        this.logger.warn(
          `Job "${key}" did not have a notification configuration`,
        );
        return;
      }

      if (!ctx.document.notification) {
        this.logger.warn(`Job "${key}" did not have a notification payload`);
        return;
      }
      await this.notificationManager.send(ctx.document.notification);
      await ctx.setNotificationSent();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Job "${key}" threw an unhandled error: ${message}`);
    }
  }
}
