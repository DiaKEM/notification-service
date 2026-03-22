import { Injectable } from '@nestjs/common';
import { JobType } from '../../job-type/job-type.decorator';
import { JobExecutionService } from '../../job-execution/job-execution.service';
import { GlucoseReportService } from '../../glucose-report/glucose-report.service';
import { ReportJobBase } from '../../glucose-report/report-job-base';
import { JobConfigurationService } from '../../job-configuration/job-configuration.service';
import { NotificationManagerService } from '../../notification-manager/notification-manager.service';

export const NIGHTLY_REPORT_JOB_KEY = 'nightly-report';

@Injectable()
@JobType(NIGHTLY_REPORT_JOB_KEY)
export class NightlyReportJob extends ReportJobBase {
  constructor(
    jobExecutionService: JobExecutionService,
    glucoseReport: GlucoseReportService,
    jobConfigService: JobConfigurationService,
    notificationManager: NotificationManagerService,
  ) {
    super(NIGHTLY_REPORT_JOB_KEY, jobExecutionService, glucoseReport, jobConfigService, notificationManager);
  }

  protected get reportTitle(): string { return 'Nightly Report'; }
  protected get reportPeriodLabel(): string { return 'Nightly (00:00–06:00)'; }

  protected getTimeWindow(): { from: Date; to: Date } | { error: string } {
    const now = new Date();
    if (now.getHours() < 6) {
      return {
        error: `Nightly report executed at ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} — period not yet complete (must run after 06:00)`,
      };
    }
    const from = new Date(now); from.setHours(0, 0, 0, 0);
    const to = new Date(now);   to.setHours(6, 0, 0, 0);
    return { from, to };
  }
}
