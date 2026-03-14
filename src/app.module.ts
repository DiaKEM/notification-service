import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NightscoutModule } from './nightscout/nightscout.module';
import { PushoverModule } from './pushover/pushover.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NightscoutModule,
    PushoverModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
