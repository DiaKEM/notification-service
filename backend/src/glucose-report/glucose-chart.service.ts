import { Injectable } from '@nestjs/common';
import * as vega from 'vega';
import sharp from 'sharp';
import type { GlucoseReportStats } from './glucose-report.service';

const RANGE_COLORS: Record<string, string> = {
  'Very Low': '#7b1d1d',
  'Low':      '#e67e22',
  'In Range': '#27ae60',
  'High':     '#f39c12',
  'Very High':'#c0392b',
};

@Injectable()
export class GlucoseChartService {
  async renderDonut(stats: GlucoseReportStats, title = 'Report'): Promise<Buffer> {
    const tableValues = stats.ranges.map((r) => ({
      label: `${r.name}: ${r.percentage}%`,
      value: r.percentage,
      color: RANGE_COLORS[r.name] ?? '#9e9e9e',
    }));

    const spec: vega.Spec = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      width: 480,
      height: 300,
      padding: 20,
      background: '#ffffff',
      title: {
        text: [
          title,
          `Avg: ${stats.average} ${stats.unit}  |  TIR: ${stats.tir}%`,
        ] as string[],
        fontSize: 14,
        fontWeight: 'bold' as const,
        color: '#333333',
        anchor: 'middle' as const,
        offset: 6,
      },
      data: [
        {
          name: 'table',
          values: tableValues,
          transform: [{ type: 'pie' as const, field: 'value' }],
        },
      ],
      scales: [
        {
          name: 'color',
          type: 'ordinal' as const,
          domain: { data: 'table', field: 'label' },
          range: tableValues.map((v) => v.color),
        },
      ],
      legends: [
        {
          fill: 'color',
          orient: 'right' as const,
          labelFontSize: 12,
          symbolSize: 200,
          rowPadding: 6,
        },
      ],
      marks: [
        {
          type: 'arc' as const,
          from: { data: 'table' },
          encode: {
            update: {
              fill: { scale: 'color', field: 'label' },
              x: { signal: 'width / 2 - 60' },
              y: { signal: 'height / 2' },
              startAngle: { field: 'startAngle' },
              endAngle: { field: 'endAngle' },
              innerRadius: { value: 75 },
              outerRadius: { value: 135 },
              cornerRadius: { value: 3 },
              stroke: { value: '#ffffff' },
              strokeWidth: { value: 2 },
            },
          },
        },
        {
          type: 'text' as const,
          encode: {
            update: {
              x: { signal: 'width / 2 - 60' },
              y: { signal: 'height / 2 - 8' },
              text: { value: `${stats.tir}%` },
              align: { value: 'center' as const },
              baseline: { value: 'middle' as const },
              fontSize: { value: 24 },
              fontWeight: { value: 'bold' as const },
              fill: { value: '#27ae60' },
            },
          },
        },
        {
          type: 'text' as const,
          encode: {
            update: {
              x: { signal: 'width / 2 - 60' },
              y: { signal: 'height / 2 + 18' },
              text: { value: 'TIR' },
              align: { value: 'center' as const },
              baseline: { value: 'middle' as const },
              fontSize: { value: 11 },
              fill: { value: '#888888' },
            },
          },
        },
      ],
    };

    const view = new vega.View(vega.parse(spec), {
      renderer: 'none',
      logLevel: vega.Warn,
    });
    await view.runAsync();
    const svgString = await view.toSVG();
    await view.finalize();

    return sharp(Buffer.from(svgString)).png().toBuffer();
  }
}
