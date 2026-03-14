import { Module } from '@nestjs/common';
import { JobConfigurationModule } from '../job-configuration/job-configuration.module';
import { JobExecutionModule } from '../job-execution/job-execution.module';
import { JobTypeModule } from '../job-type/job-type.module';
import { JobManagerService } from './job-manager.service';

@Module({
  imports: [JobTypeModule, JobConfigurationModule, JobExecutionModule],
  providers: [JobManagerService],
  exports: [JobManagerService],
})
export class JobManagerModule {}
