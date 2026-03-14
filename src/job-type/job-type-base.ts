import { Log } from '../log/log.schema';

export abstract class JobTypeBase {
  abstract execute(): Promise<Log[]>;
}
