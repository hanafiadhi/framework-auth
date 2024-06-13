import { Controller, Get, Param, Delete, Version } from '@nestjs/common';

@Controller('Authentication/health')
export class HealthController {
  @Version('1')
  @Get()
  findOne(@Param('id') id: string) {
    true;
  }
}
