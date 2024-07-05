import { Controller, Get, Version } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { RmqHealthIndicator } from './health.service';
import {
  AUTH_SERVICE,
  REDIS_SERVICE,
  TENANT_SERVICE,
  USER_SERVICE,
} from '../common';

@Controller('auth/health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private rmqHealthIndicator: RmqHealthIndicator,
  ) {}

  @Get()
  @Version('1')
  @HealthCheck()
  check() {
    return this.health.check([
    //   async () => this.rmqHealthIndicator.isHealthQueue(AUTH_SERVICE),
      async () => this.rmqHealthIndicator.isHealthConsumer(AUTH_SERVICE),
    ]);
  }
}
