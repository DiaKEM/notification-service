import { Injectable, Logger } from '@nestjs/common';
import { JobExecutionService } from '../job-execution/job-execution.service';
import { LogLevel } from '../log/log.schema';
import { JobTypeRegistryService } from '../job-type/job-type-registry.service';
import { JobTypeKey } from '../job-type/job-type.registry';

@Injectable()
export class JobManagerService {
  private readonly logger = new Logger(JobManagerService.name);

  constructor(
    private readonly jobTypeRegistry: JobTypeRegistryService,
    private readonly jobExecutionService: JobExecutionService,
  ) {}

  async runAll(): Promise<void> {
    const keys = this.jobTypeRegistry.getRegisteredKeys();
    this.logger.log(`Running all job types: ${keys.join(', ')}`);
    await Promise.all(keys.map((key) => this.run(key)));
  }

  async run(key: JobTypeKey): Promise<void> {
    const job = this.jobTypeRegistry.resolve(key);
    const execution = await this.jobExecutionService.create(key);

    try {
      const logs = await job.execute();
      await this.jobExecutionService.complete(
        execution._id.toString(),
        logs,
        'success',
      );
      this.logger.log(
        `Job "${key}" completed successfully with ${logs.length} log(s)`,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      await this.jobExecutionService.complete(
        execution._id.toString(),
        [
          {
            timestamp: new Date(),
            level: LogLevel.ERROR,
            message: `Unhandled error: ${message}`,
          },
        ],
        'failed',
      );
      this.logger.error(`Job "${key}" failed: ${message}`);
    }
  }
}
