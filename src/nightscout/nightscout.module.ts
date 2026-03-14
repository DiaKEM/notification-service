import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NightscoutService } from './nightscout.service';

@Module({
  imports: [ConfigModule],
  providers: [NightscoutService],
  exports: [NightscoutService],
})
export class NightscoutModule {}
