import { JobTypeBase } from './job-type-base';

export class JobTypeRegistry {
  private static readonly registry = new Map<string, typeof JobTypeBase>();

  static register(key: string, target: typeof JobTypeBase): void {
    this.registry.set(key, target);
  }

  static get(key: string): typeof JobTypeBase | undefined {
    return this.registry.get(key);
  }

  static getAll(): Map<string, typeof JobTypeBase> {
    return new Map(this.registry);
  }
}
