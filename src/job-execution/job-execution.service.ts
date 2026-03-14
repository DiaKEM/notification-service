import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from '../log/log.schema';
import { JobExecution, JobExecutionDocument, ExecutionStatus } from './job-execution.schema';

@Injectable()
export class JobExecutionService {
  constructor(
    @InjectModel(JobExecution.name)
    private readonly model: Model<JobExecutionDocument>,
  ) {}

  create(
    jobTypeKey: string,
    jobConfigurationId?: string,
  ): Promise<JobExecutionDocument> {
    return this.model.create({
      jobTypeKey,
      ...(jobConfigurationId && { jobConfigurationId }),
      startedAt: new Date(),
      status: 'running',
      logs: [],
    });
  }

  async complete(
    id: string,
    logs: Log[],
    status: Exclude<ExecutionStatus, 'running'>,
  ): Promise<JobExecutionDocument | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { $set: { logs, status, finishedAt: new Date() } },
        { new: true },
      )
      .exec();
  }

  async appendLog(id: string, log: Log): Promise<void> {
    await this.model
      .findByIdAndUpdate(id, { $push: { logs: log } })
      .exec();
  }

  findByJobType(jobTypeKey: string): Promise<JobExecutionDocument[]> {
    return this.model.find({ jobTypeKey }).sort({ startedAt: -1 }).exec();
  }

  findLatest(limit = 20): Promise<JobExecutionDocument[]> {
    return this.model.find().sort({ startedAt: -1 }).limit(limit).exec();
  }
}
