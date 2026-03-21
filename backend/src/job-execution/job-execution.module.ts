import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobExecution, JobExecutionSchema } from './job-execution.schema';
import { JobExecutionService } from './job-execution.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobExecution.name, schema: JobExecutionSchema },
    ]),
  ],
  providers: [JobExecutionService],
  exports: [JobExecutionService],
})
export class JobExecutionModule {}
