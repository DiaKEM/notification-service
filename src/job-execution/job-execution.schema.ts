import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Log, LogSchema } from '../log/log.schema';

export type ExecutionStatus = 'running' | 'success' | 'failed';

@Schema({ collection: 'job_executions', timestamps: true })
export class JobExecution {
  @Prop({ required: true })
  jobTypeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'JobConfiguration' })
  jobConfigurationId?: Types.ObjectId;

  @Prop({ type: [LogSchema], default: [] })
  logs: Log[];

  @Prop({ required: true })
  startedAt: Date;

  @Prop()
  finishedAt?: Date;

  @Prop({
    required: true,
    enum: ['running', 'success', 'failed'],
    default: 'running',
  })
  status: ExecutionStatus;
}

export type JobExecutionDocument = HydratedDocument<JobExecution>;

export const JobExecutionSchema = SchemaFactory.createForClass(JobExecution);
