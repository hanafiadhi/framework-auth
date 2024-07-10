import { Test, TestingModule } from '@nestjs/testing';

import { BadGatewayException, UnauthorizedException } from '@nestjs/common';
import { AuthenticationController } from '../src/iam/authentication/authentication.controller';
import { AuthenticationService } from '../src/iam/authentication/authentication.service';
import { SignInDto } from '../src/iam/authentication/dto/sign-in.dto';
import { HashingService } from '../src/iam/hashing.service';
import { BcryptService } from '../src/iam/hashing/bcrypt.service';
import { UserClientService } from '../src/consumer/use-case/user.use-case';
import { UserService } from '../src/consumer/service/user.service';
import { TenantClientService } from '../src/consumer/use-case/tenant.use-case';
import { TenantService } from '../src/consumer/service/tenant.service';
import { RedisClientService } from '../src/consumer/use-case/redis.use-cae';
import { RedisService } from '../src/consumer/service/redis.service';
import { LocalStrategy } from '../src/iam/authentication/strategy/local-strategy';
import { OtpAuthenticationService } from '../src/iam/authentication/otp-authentication.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../src/common/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '../src/providers/queue/rabbbitmq/rmq.module';
import { REDIS_SERVICE, TENANT_SERVICE, USER_SERVICE } from '../src/common';
import { PassportModule } from '@nestjs/passport';
import config from '../src/common/config';

describe('AuthController', () => {
  let authController: AuthenticationController;
  let authService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: config,
          isGlobal: true,
          cache: true,
          ignoreEnvFile: false,
          envFilePath: ['./env/.env.development'],
        }),
        RmqModule.register({ name: USER_SERVICE }),
        RmqModule.register({ name: TENANT_SERVICE }),
        RmqModule.register({ name: REDIS_SERVICE }),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
        PassportModule,
      ],
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            signIn: jest.fn(),
          },
        },
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
    }).compile();

    authController = module.get<AuthenticationController>(
      AuthenticationController,
    );
    authService = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('signInv2', () => {
    it('should return token if signIn is successful', async () => {
      const signInDto: SignInDto = {
        username: 'testuser',
        password: 'password123',
        applications: 'app1',
      };

      const result = {
        sub: 'any',
        username: 'any',
        tenant_id: 'any',
        role: 'any',
        accessToken: 'string',
        refreshToken: '',
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      expect(await authController.signInv2(signInDto)).toBe(result);
    });

    it('should throw UnauthorizedException if signIn fails', async () => {
      const signInDto: SignInDto = {
        username: 'testuser',
        password: 'password123',
        applications: 'app1',
      };

      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.signInv2(signInDto)).rejects.toThrow(
        BadGatewayException,
      );
    });
  });
});
