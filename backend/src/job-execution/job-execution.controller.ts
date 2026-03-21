import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JobExecutionService } from './job-execution.service';
import { JobExecution } from './job-execution.schema';
import type { ExecutionStatus } from './job-execution.schema';

@ApiTags('job-executions')
@ApiSecurity('X-Api-Key')
@ApiBearerAuth()
@Controller('/api/job-executions')
export class JobExecutionController {
  constructor(private readonly service: JobExecutionService) {}

  @Get()
  @ApiOperation({
    summary: 'List job executions',
    description: 'Returns job executions, optionally filtered. Sorted by startedAt descending.',
  })
  @ApiQuery({ name: 'jobTypeKey', required: false, example: 'pump-age' })
  @ApiQuery({ name: 'status', required: false, enum: ['running', 'success', 'skipped', 'failed'] })
  @ApiQuery({ name: 'from', required: false, description: 'ISO date — executions started at or after this time' })
  @ApiQuery({ name: 'to', required: false, description: 'ISO date — executions started at or before this time' })
  @ApiQuery({ name: 'needsNotification', required: false, enum: ['true', 'false'] })
  @ApiQuery({ name: 'limit', required: false, description: 'Max records to return (default 100)' })
  @ApiOkResponse({ type: [JobExecution] })
  findAll(
    @Query('jobTypeKey') jobTypeKey?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('needsNotification') needsNotification?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.find({
      jobTypeKey: jobTypeKey || undefined,
      status: (status as ExecutionStatus) || undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      needsNotification:
        needsNotification === 'true' ? true
        : needsNotification === 'false' ? false
        : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
