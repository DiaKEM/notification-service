import { Module } from '@nestjs/common';
import { NightscoutModule } from '../nightscout/nightscout.module';
import { PumpAgeJob } from './pump-age.job';

@Module({
  imports: [NightscoutModule],
  providers: [PumpAgeJob],
  exports: [PumpAgeJob],
})
export class PumpAgeModule {}
