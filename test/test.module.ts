import { Module } from '@nestjs/common';
import { TestService } from './test.service';

import { AUTH_SERVICE, REDIS_SERVICE, USER_SERVICE } from '../src/common';
import { UserClientService } from '../src/consumer/use-case/user.use-case';
import { UserService } from '../src/consumer/service/user.service';
import { RedisClientService } from '../src/consumer/use-case/redis.use-cae';
import { RedisService } from '../src/consumer/service/redis.service';
import { RmqModule } from '../src/providers/queue/rabbbitmq/rmq.module';

@Module({
  imports: [
    RmqModule.register({ name: AUTH_SERVICE }),
    RmqModule.register({ name: USER_SERVICE }),
    RmqModule.register({ name: REDIS_SERVICE }),
  ],
  providers: [
    TestService,
    { provide: UserClientService, useClass: UserService },
    { provide: RedisClientService, useClass: RedisService },
  ],
})
export class TestModule {}
