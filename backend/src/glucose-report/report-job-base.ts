import { JobTypeBase } from '../job-type/job-type-base';
import { JobExecutionContext } from '../job-execution/job-execution.context';
import { JobExecutionService } from '../job-execution/job-execution.service';
import { GlucoseReportService } from './glucose-report.service';
import { JobConfigurationService } from '../job-configuration/job-configuration.service';
import { NotificationManagerService } from '../notification-manager/notification-manager.service';

export abstract class ReportJobBase extends JobTypeBase {
  constructor(
    protected readonly jobKey: string,
    protected readonly jobExecutionService: JobExecutionService,
    protected readonly glucoseReport: GlucoseReportService,
    protected readonly jobConfigService: JobConfigurationService,
    protected readonly notificationManager: NotificationManagerService,
  ) {
    super();
  }

  protected abstract get reportTitle(): string;
  protected abstract get reportPeriodLabel(): string;
  protected abstract getTimeWindow(): { from: Date; to: Date } | { error: string };

  async execute(): Promise<JobExecutionContext> {
    const ctx = await this.jobExecutionService.create(this.jobKey);
    try {
      const window = this.getTimeWindow();
      if ('error' in window) {
        await ctx.error(window.error);
        await ctx.fail();
        return ctx;
      }

      await ctx.info(
        `Computing ${this.reportTitle} for ${window.from.toISOString()} – ${window.to.toISOString()}`,
      );

      const stats = await this.glucoseReport.compute(window.from, window.to);
      if (!stats) {
        await ctx.warn('No glucose data available for the selected period');
        await ctx.skipped();
        return ctx;
      }

      await ctx.setCurrentValue(`${stats.average} ${stats.unit}`);

      const config = await this.jobConfigService.findFirst(this.jobKey);
      if (!config) {
        await ctx.warn('No job configuration found — notification providers not configured');
        await ctx.complete();
        return ctx;
      }

      await ctx.setJobConfiguration(config);

      const message = this.glucoseReport.formatReport(this.reportPeriodLabel, stats);
      await this.notificationManager.sendMessage(config.provider, {
        title: this.reportTitle,
        message,
        priority: config.priority,
      });

      await ctx.setNotificationSent();
      await ctx.info(`Report sent via ${config.provider.join(', ')}`);
      await ctx.complete();
    } catch (err: unknown) {
      await ctx.error(err?.toString() || 'Unknown error');
      await ctx.fail();
    }
    return ctx;
  }
}
