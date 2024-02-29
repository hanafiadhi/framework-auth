import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import jwtConfig from '../../common/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from 'src/common/interface/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserClientService } from 'src/consumer/use-case/user.use-case';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly userClientService: UserClientService,
  ) {}

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, this.jwtConfiguration);
    } catch (error) {
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
        { email: user.email },
      ),
      this.signToken(user._id, this.jwtConfiguration.refreshTokenTtl),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async signUp(signUpDto: SignUpDto): Promise<any> {
    try {
      signUpDto.password = await this.hashingService.hash(signUpDto.password);
      return await this.userClientService.createUser(signUpDto);
    } catch (error) {
      throw new BadRequestException(error.error);
    }
  }
  async signIn(signInDto: SignInDto) {
    const user = await this.userClientService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('email atau password salah');
    }

    const equal = await this.hashingService.compare(
      user.password,
      signInDto.password,
    );

    if (!equal) {
      throw new UnauthorizedException('Email Atau Password Salah');
    }
    return await this.generateToken(user);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, email } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub' | 'email'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
      });

      /**
       * Todo
       * Cari sub nya di redis
       * jika tidak ada throw
       */

      return await this.generateToken({ _id: sub, email });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh Token Tidak Berlaku');
      }
      throw new UnauthorizedException();
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, _id: string) {
    const user = await this.userClientService.findById(_id);
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
    changePasswordDto.newPassword = await this.hashingService.hash(
      changePasswordDto.newPassword,
    );

    return await this.userClientService.changePassword({
      _id: user._id,
      password: changePasswordDto.newPassword,
    });
  }
}
