import { Injectable } from '@nestjs/common';
import { NightscoutService } from '../nightscout/nightscout.service';
import { AdminSettingsService } from '../admin/admin-settings.service';

export interface GlucoseReportStats {
  average: number;
  unit: string;
  tir: number;
  ranges: Array<{ name: string; lowerLimit: number; upperLimit: number; percentage: number }>;
  totalReadings: number;
}

const MMOL_FACTOR = 18.0182;

@Injectable()
export class GlucoseReportService {
  constructor(
    private readonly nightscout: NightscoutService,
    private readonly adminSettings: AdminSettingsService,
  ) {}

  async compute(from: Date, to: Date): Promise<GlucoseReportStats | null> {
    const windowHours = (to.getTime() - from.getTime()) / 3_600_000;
    const count = Math.max(288, Math.ceil(windowHours * 12 * 1.2));

    const entries = await this.nightscout.getEntries({
      find: { date: { $gte: from.getTime(), $lte: to.getTime() } },
      count,
    });

    const sgvValues = entries
      .map((e) => e.sgv)
      .filter((v): v is number => typeof v === 'number' && v > 0);

    if (!sgvValues.length) return null;

    const s = await this.adminSettings.getSettings('glucose-limits');
    const unit: string = s?.unit ?? 'mg/dL';
    const configuredRanges: Array<{ name: string; lowerLimit: number; upperLimit: number }> =
      s?.ranges ? (JSON.parse(s.ranges) as Array<{ name: string; lowerLimit: number; upperLimit: number }>) : [];

    const factor = unit === 'mmol/L' ? 1 / MMOL_FACTOR : 1;
    const precision = unit === 'mmol/L' ? 1 : 0;
    const values = sgvValues.map((v) => +(v * factor).toFixed(precision + 1));

    const average = +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(precision);

    const ranges = configuredRanges.map((range) => {
      const count = values.filter((v) => v >= range.lowerLimit && v <= range.upperLimit).length;
      return {
        name: range.name,
        lowerLimit: range.lowerLimit,
        upperLimit: range.upperLimit,
        percentage: +(count / values.length * 100).toFixed(1),
      };
    });

    const inRangeSlot = ranges.find((r) => r.name === 'In Range');
    const tir = inRangeSlot?.percentage ?? 0;

    return { average, unit, tir, ranges, totalReadings: values.length };
  }

  formatReport(periodLabel: string, stats: GlucoseReportStats): string {
    const u = stats.unit;
    const lines = [
      `Average blood glucose level: ${stats.average} ${u}`,
      `Total TIR: ${stats.tir}%`,
      `--------------------------------------`,
      ...stats.ranges.map((r) => `${r.name} (${r.lowerLimit}-${r.upperLimit} ${u}): ${r.percentage}%`),
    ];
    return lines.join('\n');
  }
}
