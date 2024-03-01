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
import { RmqModule } from 'src/providers/queue/rabbbitmq/rmq.module';
import { USER_SERVICE } from 'src/common/constants/service-rmq.constant';
import { UserClientService } from 'src/consumer/use-case/user.use-case';
import { UserService } from 'src/consumer/service/user.service';
import { OtpAuthenticationService } from './authentication/otp-authentication.service';
@Module({
  imports: [
    RmqModule.register({ name: USER_SERVICE }),
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
    AuthenticationService,
    LocalStrategy,
    OtpAuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
