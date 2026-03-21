import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { JobManagerService } from '../job-manager/job-manager.service';

const DEFAULT_CRON = '0 */15 * * * *';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly jobManager: JobManagerService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    const expression = this.config.get<string>('CRON_SCHEDULE', DEFAULT_CRON);

    const job = new CronJob(expression, async () => {
      this.logger.log('Scheduled run triggered — executing all jobs');
      await this.jobManager.runAll();
    });

    this.schedulerRegistry.addCronJob('run-all', job);
    job.start();

    this.logger.log(`Scheduler registered with expression: ${expression}`);
  }
}
