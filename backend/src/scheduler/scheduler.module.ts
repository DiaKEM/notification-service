import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JobManagerModule } from '../job-manager/job-manager.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [ScheduleModule.forRoot(), JobManagerModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
