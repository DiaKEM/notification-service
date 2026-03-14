import { Injectable } from '@nestjs/common';
import { JobConfigurationDocument } from '../job-configuration/job-configuration.schema';
import { Log, LogLevel } from '../log/log.schema';
import { NightscoutService } from '../nightscout/nightscout.service';
import { JobType } from '../job-type/job-type.decorator';
import { JobTypeBase } from '../job-type/job-type-base';
import { JobConfigurationService } from '../job-configuration/job-configuration.service';

export const PUMP_AGE_JOB_KEY = 'pump-age';

@Injectable()
@JobType(PUMP_AGE_JOB_KEY)
export class PumpAgeJob extends JobTypeBase {
  constructor(
    private readonly nightscout: NightscoutService,
    private readonly jobConfigService: JobConfigurationService,
  ) {
    super();
  }

  async execute(): Promise<Log[]> {
    const logs: Log[] = [];

    const treatment = await this.nightscout.getLastPumpChange();
    if (!treatment) {
      logs.push(this.log(LogLevel.WARNING, 'No pump change found'));
      return logs;
    }
    const pumpAge = treatment?.elapsedDays;
    if (pumpAge === null) {
      logs.push(
        this.log(
          LogLevel.WARNING,
          'Could not determine pump age from device status',
        ),
      );
      return logs;
    }

    const config = await this.jobConfigService.findNextFitting(
      PUMP_AGE_JOB_KEY,
      pumpAge,
    );

    if (!config) {
      logs.push(
        this.log(
          LogLevel.INFO,
          `No configuration found for pump age threshold ${pumpAge.toFixed(2)}`,
        ),
      );

      return logs;
    }

    logs.push(
      this.log(
        LogLevel.INFO,
        `Pump age: ${pumpAge.toFixed(2)} days (threshold: ${config.threshold})`,
      ),
    );

    if (pumpAge >= config.threshold) {
      logs.push(
        this.log(
          LogLevel.WARNING,
          `Pump age ${pumpAge.toFixed(2)}d exceeds threshold ${config.threshold}d — notification required`,
        ),
      );
    } else {
      logs.push(
        this.log(
          LogLevel.INFO,
          `Pump age ${pumpAge.toFixed(2)}d is below threshold ${config.threshold}d — no action needed`,
        ),
      );
    }

    return logs;
  }

  private log(level: LogLevel, message: string): Log {
    return { timestamp: new Date(), message, level };
  }
}
