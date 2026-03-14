import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationProvider = 'pushover' | 'telegram';

export enum NotificationPriority {
  LOW = 'low',
  MID = 'mid',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Schema({ _id: false })
export class NotificationConfig {
  @Prop()
  timePoint?: string; // HH:mm, e.g. "20:00"

  @Prop()
  intervalHours?: number; // e.g. 3
}

export const NotificationConfigSchema =
  SchemaFactory.createForClass(NotificationConfig);

@Schema({ collection: 'job_configurations', timestamps: true })
export class JobConfiguration {
  @Prop({ required: true })
  jobTypeKey: string;

  @Prop({ required: true })
  threshold: number;

  @Prop({ type: [NotificationConfigSchema], required: true })
  notifications: NotificationConfig[];

  @Prop({ required: true, enum: ['pushover', 'telegram'] })
  provider: NotificationProvider;

  @Prop({ required: true, enum: NotificationPriority })
  priority: NotificationPriority;
}

export type JobConfigurationDocument = HydratedDocument<JobConfiguration>;

export const JobConfigurationSchema =
  SchemaFactory.createForClass(JobConfiguration);
