import { Injectable } from '@nestjs/common';
import { JobType } from '../../job-type/job-type.decorator';
import { JobExecutionService } from '../../job-execution/job-execution.service';
import { GlucoseReportService } from '../../glucose-report/glucose-report.service';
import { ReportJobBase } from '../../glucose-report/report-job-base';
import { JobConfigurationService } from '../../job-configuration/job-configuration.service';
import { NotificationManagerService } from '../../notification-manager/notification-manager.service';

export const DAY_REPORT_JOB_KEY = 'day-report';

@Injectable()
@JobType(DAY_REPORT_JOB_KEY)
export class DayReportJob extends ReportJobBase {
  constructor(
    jobExecutionService: JobExecutionService,
    glucoseReport: GlucoseReportService,
    jobConfigService: JobConfigurationService,
    notificationManager: NotificationManagerService,
  ) {
    super(DAY_REPORT_JOB_KEY, jobExecutionService, glucoseReport, jobConfigService, notificationManager);
  }

  protected get reportTitle(): string { return 'Daily Report'; }
  protected get reportPeriodLabel(): string {
    return `Today (${new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })})`;
  }

  protected getTimeWindow(): { from: Date; to: Date } | { error: string } {
    const to = new Date();
    const from = new Date(to);
    from.setHours(0, 0, 0, 0);
    return { from, to };
  }
}
