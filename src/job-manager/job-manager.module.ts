import { Module } from '@nestjs/common';
import { JobTypeModule } from '../job-type/job-type.module';
import { NotificationManagerModule } from '../notification-manager/notification-manager.module';
import { NotificationCheckerModule } from '../notification-checker/notification-checker.module';
import { JobManagerService } from './job-manager.service';

@Module({
  imports: [JobTypeModule, NotificationManagerModule, NotificationCheckerModule],
  providers: [JobManagerService],
  exports: [JobManagerService],
})
export class JobManagerModule {}
