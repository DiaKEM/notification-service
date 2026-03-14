import { Log } from '../log/log.schema';
import { JobConfigurationDocument } from '../job-configuration/job-configuration.schema';

export abstract class JobTypeBase {
  abstract execute(config: JobConfigurationDocument): Promise<Log[]>;
}
