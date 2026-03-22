import { Module } from '@nestjs/common';
import { NightscoutModule } from '../nightscout/nightscout.module';
import { AdminSettingsModule } from '../admin/admin-settings.module';
import { GlucoseReportService } from './glucose-report.service';

@Module({
  imports: [NightscoutModule, AdminSettingsModule],
  providers: [GlucoseReportService],
  exports: [GlucoseReportService],
})
export class GlucoseReportModule {}
