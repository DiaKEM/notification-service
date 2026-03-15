import { Model } from 'mongoose';
import { JobConfiguration } from '../job-configuration/job-configuration.schema';
import { LogLevel } from '../log/log.schema';
import * as jobExecutionSchema from './job-execution.schema';
import { InjectModel } from '@nestjs/mongoose';

export class JobExecutionContext {
  constructor(
    readonly document: jobExecutionSchema.JobExecutionDocument,
    @InjectModel(jobExecutionSchema.JobExecution.name)
    private readonly model: Model<jobExecutionSchema.JobExecutionDocument>,
  ) {}

  private get id(): string {
    return this.document._id.toString();
  }

  // ── Logging ────────────────────────────────────────────────────────────────

  async info(message: string): Promise<void> {
    await this.pushLog(LogLevel.INFO, message);
  }

  async warn(message: string): Promise<void> {
    await this.pushLog(LogLevel.WARNING, message);
  }

  async error(message: string): Promise<void> {
    await this.pushLog(LogLevel.ERROR, message);
  }

  // ── Fields ─────────────────────────────────────────────────────────────────

  async setCurrentValue(currentValue: string): Promise<void> {
    await this.model
      .findByIdAndUpdate(this.id, { $set: { currentValue } })
      .exec();
  }

  async setStatus(status: jobExecutionSchema.ExecutionStatus): Promise<void> {
    await this.model.findByIdAndUpdate(this.id, { $set: { status } }).exec();
  }

  async setJobConfiguration(jobConfiguration: JobConfiguration): Promise<void> {
    await this.model
      .findByIdAndUpdate(this.id, { $set: { jobConfiguration } })
      .exec();
  }

  // ── Completion ─────────────────────────────────────────────────────────────

  async complete(): Promise<void> {
    await this.model
      .findByIdAndUpdate(this.id, {
        $set: { status: 'success', finishedAt: new Date() },
      })
      .exec();
  }

  async fail(): Promise<void> {
    await this.model
      .findByIdAndUpdate(this.id, {
        $set: { status: 'failed', finishedAt: new Date() },
      })
      .exec();
  }

  async skipped(): Promise<void> {
    await this.model
      .findByIdAndUpdate(this.id, {
        $set: { status: 'skipped', finishedAt: new Date() },
      })
      .exec();
  }

  async needsNotification(): Promise<void> {
    await this.model
      .findByIdAndUpdate(this.id, {
        $set: { needsNotification: true, finishedAt: new Date() },
      })
      .exec();
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private async pushLog(level: LogLevel, message: string): Promise<void> {
    const log = { timestamp: new Date(), level, message };
    await this.model
      .findByIdAndUpdate(this.id, { $push: { logs: log } })
      .exec();
  }
}
