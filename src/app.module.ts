import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NightscoutModule } from './nightscout/nightscout.module';
import { PushoverModule } from './pushover/pushover.module';
import { TelegramModule } from './telegram/telegram.module';
import { JobConfigurationModule } from './job-configuration/job-configuration.module';
import { JobExecutionModule } from './job-execution/job-execution.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    NightscoutModule,
    PushoverModule,
    TelegramModule,
    JobConfigurationModule,
    JobExecutionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
