import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { JobConfiguration } from './job-configuration.schema';
import { JobConfigurationService } from './job-configuration.service';

@Controller('/api/job-configurations')
export class JobConfigurationController {
  constructor(private readonly service: JobConfigurationService) {}

  @Get()
  findAll(@Query('jobTypeKey') jobTypeKey?: string) {
    if (jobTypeKey) {
      return this.service.findByJobTypeKey(jobTypeKey);
    }
    return this.service.findAll();
  }

  @Post()
  create(@Body() body: JobConfiguration) {
    return this.service.create(body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<JobConfiguration>,
  ) {
    const updated = await this.service.update(id, body);
    if (!updated)
      throw new NotFoundException(`JobConfiguration ${id} not found`);
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
