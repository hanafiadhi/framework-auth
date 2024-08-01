import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing.service';
import { SignInDto, SignInMobileDto } from './dto/sign-in.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import jwtConfig from '../../common/config/jwt.config';
import { ConfigType } from '@nestjs/config';

import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { OtpAuthenticationService } from './otp-authentication.service';
import { TenantClientService } from '../../consumer/use-case/tenant.use-case';
import { RedisClientService } from '../../consumer/use-case/redis.use-cae';
import { ActiveUserData } from '../../common/interface/active-user-data.interface';
import { UserClientService } from '../../consumer/use-case/user.use-case';
import { VolunteerClientService } from '../../consumer/use-case/volunteer.use-case';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly userClientService: UserClientService,
    private readonly tenantClientService: TenantClientService,
    private readonly volunteerClientService: VolunteerClientService,
    private readonly redisClientService: RedisClientService,
    private readonly otpAuthenticationService: OtpAuthenticationService,
  ) {}

  async verifyToken(token: string) {
    try {
      const data: ActiveUserData = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      const checkTokenRedis = await this.redisClientService.getCache({
        key: data.sub,
      });
      if (!checkTokenRedis) {
        throw new Error(
          `user : ${data.username} , Token is Not Found in Redis`,
        );
      }
      return data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
  private async signToken<T>(
    userId: number | string,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
  async generateToken(user: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user._id,
        this.jwtConfiguration.accessTokenTtl,
        { username: user.username, tenant_id: user.tenant_id, role: user.role },
      ),
      this.signToken(user._id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    await this.redisClientService.saveOrUpdateCache({
      key: user._id,
      value: accessToken,
    });

    return {
      sub: user._id,
      username: user.username,
      tenant_id: user.tenant_id,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }
  async signUp(signUpDto: SignUpDto, newUser: any): Promise<any> {
    let _idUser;
    try {
      if (
        signUpDto.token ||
        (Object.keys(signUpDto).length == 1 &&
          Object.keys(signUpDto).includes('whatsapp'))
      ) {
        return await this.userClientService.registerMobile({
          whatsapp: signUpDto.whatsapp,
          ...(Object.keys(signUpDto).includes('token') && {
            token: signUpDto.token,
          }),
          token: signUpDto.token,
        });
      }
      const { _id } = await this.userClientService.createUser(newUser);
      _idUser = _id;
      const {
        paging: { totalItems },
      } = await this.volunteerClientService.findAll({
        page: '1',
        limit: '1',
        fields: 'volunteer_code',
        tenant_id: { eq: newUser.tenant_id },
      });
      signUpDto.volunteer_code = `${newUser.tenant_id}${
        signUpDto.volunteer_code
      }${totalItems + 1}`;
      signUpDto.tenant_id = newUser.tenant_id;
      signUpDto.user_id = _id;
      delete signUpDto.password;
      await this.volunteerClientService.create(signUpDto);
      await this.userClientService.registerMobile({
        whatsapp: signUpDto.whatsapp,
      });
      return;
    } catch (error) {
      if (
        error.message == 'username sudah digunakan' ||
        error.message == 'whatsapp sudah digunakan'
      ) {
        await this.userClientService.hardRemove(_idUser);
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: {
            ['whatsapp']: [`whatsapp sudah digunakan`],
          },
        });
      }
      throw error;
    }
  }
  async signIn(signInDto: SignInDto) {
    const user = await this.userClientService.findByUsername(
      signInDto.username,
    );

    if (!user) throw new UnauthorizedException('username atau password salah');
    if (
      user.hasOwnProperty('applications') &&
      !user?.applications?.includes(signInDto.applications)
    ) {
      throw new UnauthorizedException('Username Atau Password Salah');
    }

    if (user.is_active == false) {
      throw new UnauthorizedException('User tidak aktif');
    }

    /**
     * bisa di cek dulu apakah user.isTfa itu true kalo true maka boleh verivy codenya jika tidak throw 401
     */
    if (signInDto.tfaSecrect) {
      //   const isValid = await this.otpAuthenticationService.verifyCode(
      //     user.tfaSecrect,
      //     signInDto.email,
      //     user._id
      //   );
      const isValid = await this.otpAuthenticationService.verifyCode(
        signInDto.tfaSecrect,
        user.tfaToken,
        user._id,
      );
      if (!isValid) {
        throw new UnauthorizedException('Invalid 2FA Code');
      }
    } else {
      const equal = await this.hashingService.compare(
        user.password,
        signInDto.password,
      );

      const tenant = await this.tenantClientService.findTenant(user.tenant_id);

      if (tenant == null) {
        throw new UnauthorizedException(
          'Tenant tidak aktif atau periode tenant telah berakhir',
        );
      }

      const currentDate = new Date();
      const periodEndDate = new Date(tenant.period_end);

      if (!tenant.isActive || periodEndDate < currentDate) {
        throw new UnauthorizedException(
          'Tenant tidak aktif atau periode tenant telah berakhir',
        );
      }

      if (!equal) {
        throw new UnauthorizedException('Username Atau Password Salah');
      }
    }

    return await this.generateToken(user);
  }

  async signInMobile(signInDto: SignInMobileDto) {
    const user = await this.userClientService.findByUsername(
      signInDto.username,
    );

    if (!user) throw new UnauthorizedException('username atau password salah');

    if (
      user.hasOwnProperty('applications') &&
      !user?.applications?.includes('mobile-canvassing')
    ) {
      throw new UnauthorizedException('Username Atau Password Salah');
    }

    if (user.is_active == false) {
      throw new UnauthorizedException('User tidak aktif');
    }

    const equal = await this.hashingService.compare(
      user.password,
      signInDto.password,
    );

    if (!equal) {
      throw new UnauthorizedException('Username Atau Password Salah');
    }
    try {
      const token = await this.generateToken(user);
      await this.userClientService.updateUser({
        userId: user._id,
        data: {
          last_logged_information: {
            device_id: signInDto.device_id,
            device_brand: signInDto.device_brand,
            device_model: signInDto.device_model,
            device_manufacture: signInDto.device_manufacture,
            device_os: signInDto.device_os,
            device_os_version: signInDto.device_os_version,
          },
        },
      });
      return token;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, username, tenant_id, role } =
        await this.jwtService.verifyAsync<
          Pick<ActiveUserData, 'sub' | 'username' | 'tenant_id' | 'role'>
        >(refreshTokenDto.refreshToken, {
          secret: this.jwtConfiguration.secret,
        });

      /**
       * Todo
       * Cari sub nya di redis
       * jika tidak ada throw
       */

      return await this.generateToken({ _id: sub, username, tenant_id, role });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh Token Tidak Berlaku');
      }
      throw new UnauthorizedException();
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, username: string) {
    const user = await this.userClientService.findByUsername(username);
    if (!user) {
      throw new NotFoundException(user);
    }

    const equal = await this.hashingService.compare(
      user.password,
      changePasswordDto.oldPassword,
    );

    if (!equal) {
      throw new BadRequestException('Password Tidak Cocok');
    }

    return await this.userClientService.updateUser({
      userId: user._id,
      data: { password: changePasswordDto.newPassword },
    });
  }

  async logout(sub: string) {
    await this.redisClientService.deleteCache({
      key: sub,
    });
  }

  async forgetPasssword(whatsapp: string, otp?: string, password?: string) {
    return await this.userClientService.forgetPassword({
      whatsapp,
      otp,
      password,
    });
  }
}
