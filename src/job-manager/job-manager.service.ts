import { Injectable, Logger } from '@nestjs/common';
import { JobTypeRegistryService } from '../job-type/job-type-registry.service';
import { JobTypeKey } from '../job-type/job-type.registry';

@Injectable()
export class JobManagerService {
  private readonly logger = new Logger(JobManagerService.name);

  constructor(private readonly jobTypeRegistry: JobTypeRegistryService) {}

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Job "${key}" threw an unhandled error: ${message}`);
    }
  }
}
