import { Module } from '@nestjs/common';
import { JobExecutionModule } from '../../job-execution/job-execution.module';
import { GlucoseReportModule } from '../../glucose-report/glucose-report.module';
import { JobConfigurationModule } from '../../job-configuration/job-configuration.module';
import { NotificationManagerModule } from '../../notification-manager/notification-manager.module';
import { YesterdayReportJob } from './yesterday-report.job';

@Module({
  imports: [JobExecutionModule, GlucoseReportModule, JobConfigurationModule, NotificationManagerModule],
  providers: [YesterdayReportJob],
  exports: [YesterdayReportJob],
})
export class YesterdayReportModule {}
