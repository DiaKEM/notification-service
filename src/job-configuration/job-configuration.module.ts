import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobConfiguration,
  JobConfigurationSchema,
} from './job-configuration.schema';
import { JobConfigurationService } from './job-configuration.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobConfiguration.name, schema: JobConfigurationSchema },
    ]),
  ],
  providers: [JobConfigurationService],
  exports: [JobConfigurationService],
})
export class JobConfigurationModule {}
