import { JobTypeBase } from './job-type-base';

export type JobTypeKey =
  | 'pump-age'
  | 'pump-occlusion'
  | 'insulin-level'
  | 'sensor-age';

// Populated by @JobType() at class-definition time, before the DI container starts.
export const JOB_TYPE_STORE = new Map<JobTypeKey, typeof JobTypeBase>();
