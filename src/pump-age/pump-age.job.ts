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

    const statuses = await this.nightscout.getDeviceStatuses({ count: 1 });

    if (!statuses.length) {
      logs.push(
        this.log(LogLevel.WARNING, 'No device status found in Nightscout'),
      );
      return logs;
    }

    const latest = statuses[0];
    const pumpAge = this.resolvePumpAgeInDays(latest);

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

  private resolvePumpAgeInDays(
    deviceStatus: Record<string, unknown>,
  ): number | null {
    // Nightscout stores pump reservoir/battery info under deviceStatus.pump
    const pump = deviceStatus['pump'] as Record<string, unknown> | undefined;
    const reservoir = pump?.['reservoir'] as
      | Record<string, unknown>
      | undefined;
    const clock =
      reservoir?.['clock'] ?? pump?.['clock'] ?? deviceStatus['created_at'];

    if (!clock || typeof clock !== 'string') return null;

    const insertedAt = new Date(clock);
    if (isNaN(insertedAt.getTime())) return null;

    const ageMs = Date.now() - insertedAt.getTime();
    return ageMs / (1000 * 60 * 60 * 24);
  }

  private log(level: LogLevel, message: string): Log {
    return { timestamp: new Date(), message, level };
  }
}
