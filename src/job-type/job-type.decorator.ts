import { JobTypeBase } from './job-type-base';
import { JobTypeKey, JobTypeRegistry } from './job-type.registry';

export function JobType(key: JobTypeKey): ClassDecorator {
  return (target: Function) => {
    const jobTypeKey = key ?? target.name;
    JobTypeRegistry.register(jobTypeKey, target as typeof JobTypeBase);
  };
}
