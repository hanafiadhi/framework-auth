import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

import { ConfigModule } from '@nestjs/config';
import { RmqHealthIndicator } from './health.service';

import { USER_SERVICE } from '../common';
import { RmqModule } from '../providers/queue/rabbbitmq/rmq.module';
import { RmqService } from '../providers/queue/rabbbitmq/rmq.service';

@Module({
  imports: [
    TerminusModule,
    ConfigModule,
    RmqModule.register({ name: USER_SERVICE }),
  ],
  controllers: [HealthController],
  providers: [RmqHealthIndicator, RmqService],
})
export class HealthModule {}
