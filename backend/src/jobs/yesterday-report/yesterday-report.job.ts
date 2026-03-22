import { Injectable } from '@nestjs/common';
import { JobType } from '../../job-type/job-type.decorator';
import { JobExecutionService } from '../../job-execution/job-execution.service';
import { GlucoseReportService } from '../../glucose-report/glucose-report.service';
import { ReportJobBase } from '../../glucose-report/report-job-base';
import { JobConfigurationService } from '../../job-configuration/job-configuration.service';
import { NotificationManagerService } from '../../notification-manager/notification-manager.service';

export const YESTERDAY_REPORT_JOB_KEY = 'yesterday-report';

@Injectable()
@JobType(YESTERDAY_REPORT_JOB_KEY)
export class YesterdayReportJob extends ReportJobBase {
  constructor(
    jobExecutionService: JobExecutionService,
    glucoseReport: GlucoseReportService,
    jobConfigService: JobConfigurationService,
    notificationManager: NotificationManagerService,
  ) {
    super(YESTERDAY_REPORT_JOB_KEY, jobExecutionService, glucoseReport, jobConfigService, notificationManager);
  }

  protected get reportTitle(): string { return 'Yesterday\'s Report'; }
  protected get reportPeriodLabel(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `Yesterday (${d.toLocaleDateString(undefined, { dateStyle: 'medium' })})`;
  }

  protected getTimeWindow(): { from: Date; to: Date } | { error: string } {
    const from = new Date();
    from.setDate(from.getDate() - 1);
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  }
}
