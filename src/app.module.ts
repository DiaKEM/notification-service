import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiKeyGuard } from './auth/api-key.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NightscoutModule } from './nightscout/nightscout.module';
import { PushoverModule } from './pushover/pushover.module';
import { TelegramModule } from './telegram/telegram.module';
import { JobConfigurationModule } from './job-configuration/job-configuration.module';
import { JobExecutionModule } from './job-execution/job-execution.module';
import { PumpAgeModule } from './jobs/pump-age/pump-age.module';
import { BatteryLevelModule } from './jobs/battery-level/battery-level.module';
import { InsulinLevelModule } from './jobs/insulin-level/insulin-level.module';
import { SensorAgeModule } from './jobs/sensor-age/sensor-age.module';
import { JobTypeModule } from './job-type/job-type.module';
import { JobManagerModule } from './job-manager/job-manager.module';
import { NotificatorModule } from './notificator/notificator.module';
import { NotificationManagerModule } from './notification-manager/notification-manager.module';
import { NotificationCheckerModule } from './notification-checker/notification-checker.module';

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
    PumpAgeModule,
    BatteryLevelModule,
    InsulinLevelModule,
    SensorAgeModule,
    JobTypeModule,
    JobManagerModule,
    NotificatorModule,
    NotificationManagerModule,
    NotificationCheckerModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class AppModule {}
