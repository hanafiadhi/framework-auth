import { Module } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../common/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './authentication/strategy/local-strategy';

import { OtpAuthenticationService } from './authentication/otp-authentication.service';
import { TenantClientService } from '../consumer/use-case/tenant.use-case';
import { TenantService } from '../consumer/service/tenant.service';
import { RedisClientService } from '../consumer/use-case/redis.use-cae';
import { RedisService } from '../consumer/service/redis.service';
import { RmqModule } from '../providers/queue/rabbbitmq/rmq.module';
import { UserClientService } from '../consumer/use-case/user.use-case';
import { UserService } from '../consumer/service/user.service';
import { REDIS_SERVICE, TENANT_SERVICE, USER_SERVICE } from '../common';
@Module({
  imports: [
    RmqModule.register({ name: USER_SERVICE }),
    RmqModule.register({ name: TENANT_SERVICE }),
    RmqModule.register({ name: REDIS_SERVICE }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    PassportModule,
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    { provide: UserClientService, useClass: UserService },
    { provide: TenantClientService, useClass: TenantService },
    { provide: RedisClientService, useClass: RedisService },
    AuthenticationService,
    LocalStrategy,
    OtpAuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
