import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JobManagerModule } from '../job-manager/job-manager.module';
import { PumpAgeModule } from '../pump-age/pump-age.module';
import { RunAllCommand } from './run-all.command';
import { RunJobCommand } from './run-job.command';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    JobManagerModule,
    PumpAgeModule,
  ],
  providers: [RunAllCommand, RunJobCommand],
})
export class CliModule {}
