import { JobTypeBase } from './job-type-base';

export type JobTypeKey =
  | 'pump-age'
  | 'pump-occlusion'
  | 'insulin-level'
  | 'sensor-age';

export class JobTypeRegistry {
  private static readonly registry = new Map<JobTypeKey, typeof JobTypeBase>();

  static register(key: JobTypeKey, target: typeof JobTypeBase): void {
    this.registry.set(key, target);
  }

  static get(key: JobTypeKey): typeof JobTypeBase | undefined {
    return this.registry.get(key);
  }

  static getAll(): Map<string, typeof JobTypeBase> {
    return new Map(this.registry);
  }
}
