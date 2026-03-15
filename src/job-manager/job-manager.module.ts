import { Module } from '@nestjs/common';
import { JobTypeModule } from '../job-type/job-type.module';
import { JobManagerService } from './job-manager.service';

@Module({
  imports: [JobTypeModule],
  providers: [JobManagerService],
  exports: [JobManagerService],
})
export class JobManagerModule {}
