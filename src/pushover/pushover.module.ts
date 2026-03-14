import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PushoverService } from './pushover.service';

@Module({
  imports: [ConfigModule],
  providers: [PushoverService],
  exports: [PushoverService],
})
export class PushoverModule {}
