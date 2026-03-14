import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NightscoutModule } from './nightscout/nightscout.module';
import { PushoverModule } from './pushover/pushover.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NightscoutModule,
    PushoverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
