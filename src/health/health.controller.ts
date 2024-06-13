import { Controller, Get, Param, Delete, Version } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Version('1')
  @Get('auth')
  findOne() {
    return true;
  }
}
