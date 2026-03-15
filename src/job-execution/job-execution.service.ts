import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobExecution, JobExecutionDocument } from './job-execution.schema';
import { JobConfiguration } from '../job-configuration/job-configuration.schema';
import { JobExecutionContext } from './job-execution.context';

@Injectable()
export class JobExecutionService {
  constructor(
    @InjectModel(JobExecution.name)
    private readonly model: Model<JobExecutionDocument>,
  ) {}

  async create(jobTypeKey: string): Promise<JobExecutionContext> {
    const document = await this.model.create({
      jobTypeKey,
      startedAt: new Date(),
      status: 'running',
      needsNotification: false,
      logs: [],
    });
    return new JobExecutionContext(document, this.model);
  }

  findByJobType(jobTypeKey: string): Promise<JobExecutionDocument[]> {
    return this.model.find({ jobTypeKey }).sort({ startedAt: -1 }).exec();
  }

  findLatest(limit = 20): Promise<JobExecutionDocument[]> {
    return this.model.find().sort({ startedAt: -1 }).limit(limit).exec();
  }
}
