import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto, SignInMobileDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Response, response } from 'express';
import { AccessTokenGuard } from './guard/access-token.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiHideProperty,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TokenExpiredError } from '@nestjs/jwt';
import { OtpAuthenticationService } from './otp-authentication.service';
import { toFileStream } from 'qrcode';
import {
  ErrorBadRequestExecption,
  SignBody,
  SignMobileBody,
} from '@app/common';
import { loginResponeSuccess } from '@app/common';
import { ErrorUnauthorizedException } from '@app/common';
import { ActiveUser } from '../../common/decorators/active-user.decorator';
import { ActiveUserData } from '../../common/interface/active-user-data.interface';
import { ForgetPassword } from './dto/forget-password.dto';
import { ConfigService } from '@nestjs/config';
import { ResendOrVerif } from './dto/resend-or-verifikasi.dto';

@ApiTags('Authentication')
@Controller({ version: '1' })
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly configService: ConfigService,
    private readonly otpAuthenticationService: OtpAuthenticationService,
  ) {}

  @MessagePattern('verify-token')
  async validateUser(jwtToken: string) {
    try {
      return await this.authService.verifyToken(jwtToken);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new RpcException(
          new UnauthorizedException('Silahkan Login Kembali').getResponse(),
        );
      }
      throw new RpcException(
        new UnauthorizedException('Silahkan Login Kembali').getResponse(),
      );
    }
  }

  @MessagePattern('health-check')
  async nice(@Payload() data: any) {
    return data;
  }

  @ApiOperation({
    summary: 'registration for mobile',
  })
  @ApiBadRequestResponse({ type: ErrorBadRequestExecption })
  @ApiCreatedResponse({
    description: 'verifikasi berhasil',
    content: {
      'application/json': {
        examples: {
          generateOTP: {
            summary: 'Akun terbuat',
            value: {
              statusCode: 201,
              message: 'Berhasil membuat akun silahkan request code OTP',
            },
          },
        },
      },
    },
  })
  @Post('mobile/auth/register')
  async signUp(
    @Res({ passthrough: true }) response: Response,
    @Body() signUpDto: SignUpDto,
  ) {
    const role = this.configService.get<string>(
      'app.role_canvass',
      'user-canvassing',
    );
    const application = this.configService.get<string>(
      'app.application_canvass',
      'mobile-canvassing',
    );
    const user = {
      username: String(signUpDto.whatsapp),
      tenant_id: signUpDto.tenant_id,
      password: signUpDto.password,
      role: [role], //env
      applications: [application], //env
      is_active: false,
    };

    await this.authService.signUp(signUpDto, user);
    response
      .status(HttpStatus.CREATED)
      .json({
        message: 'Berhasil membuat akun silahkan request code OTP',
        StatusCode: HttpStatus.CREATED,
      })
      .end();
  }

  @ApiOperation({
    summary: 'resend kode otp dan juga kirim verifikasi akun',
    description:
      'Jika hanya ingin resend kode otp silahkan kirim whatsappnya saja dan ketika ingin konfirmasi kirim whatsapp dan token',
  })
  @ApiOkResponse({
    description: 'verifikasi berhasil',
    content: {
      'application/json': {
        examples: {
          generateOTP: {
            summary: 'Generate kode OTP',
            value: {
              statusCode: 200,
              message: 'berhasil generate code otp',
            },
          },
          verified: {
            summary: 'berhasil verifikasi',
            value: {
              statusCode: 200,
              message: 'verifikasi berhasil',
            },
          },
        },
      },
    },
  })
  @ApiNotAcceptableResponse({
    description: 'Not Acceptable Responses',
    content: {
      'application/json': {
        examples: {
          userVerified: {
            summary: 'User sudah diverifikasi',
            value: {
              statusCode: 406,
              message: 'User sudah diverifikasi',
            },
          },
          otpDeprecated: {
            summary: 'OTP Expired',
            value: {
              statusCode: 406,
              message: 'kode verifikasi sudah expired',
            },
          },
          wrongOtp: {
            summary: 'OTP salah',
            value: {
              statusCode: 406,
              message: 'kode verifikasi salah',
            },
          },
          banned: {
            summary: 'Banned',
            value: {
              statusCode: 406,
              message: {
                statusCode: 817216186821,
                message: 'Silahkan coba lagi',
              },
            },
          },
        },
      },
    },
  })
  @Patch('mobile/auth/resend-otp')
  async sendTokenOtp(
    @Res() response: Response,
    @Body() { whatsapp, token }: ResendOrVerif,
  ) {
    try {
      const responses = await this.authService.resendOrVerifikasiOtp(
        whatsapp,
        token,
      );
      response.status(responses['statusCode']).json(responses).end();
    } catch (error) {
      response.status(error.statusCode).json(error).end();
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBody({ required: true, type: SignBody })
  @ApiOkResponse({ type: loginResponeSuccess })
  @ApiUnauthorizedResponse({ type: ErrorUnauthorizedException })
  @ApiBadRequestResponse({ type: ErrorBadRequestExecption })
  @Post('auth/login')
  async signInv2(@Body() signIn: SignInDto) {
    return await this.authService.signIn(signIn);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBody({ required: true, type: SignMobileBody })
  @ApiOkResponse({ type: loginResponeSuccess })
  @ApiUnauthorizedResponse({ type: ErrorUnauthorizedException })
  @ApiBadRequestResponse({ type: ErrorBadRequestExecption })
  @Post('auth/mobile/login')
  async signInv2Mobile(@Body() signIn: SignInMobileDto) {
    return await this.authService.signInMobile(signIn);
  }

  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  @Post('auth/refresh-token')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @Post('auth/logout')
  @ApiBearerAuth('jwt')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @ActiveUser() user: ActiveUserData,
  ) {
    await this.authService.logout(user.sub);
    response.status(HttpStatus.OK).json({
      message: 'Selamat Anda Berhasil Logout',
      StatusCode: HttpStatus.OK,
    });
  }

  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('jwt')
  @UseGuards(AccessTokenGuard)
  @Post('auth/change-password')
  async changePassword(
    @Res({ passthrough: true }) response: Response,
    @ActiveUser() user: ActiveUserData,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(changePasswordDto, user.username);
    await this.authService.logout(user.sub);
    response.status(HttpStatus.OK).json({
      message: 'Password berhasil dirubah',
      StatusCode: HttpStatus.OK,
    });
  }

  @ApiExcludeEndpoint()
  @Post('auth/forget-password')
  async forgetPassword(
    @Res({ passthrough: true }) response: Response,
    @Body() { whatsapp, otp, password }: ForgetPassword,
  ) {
    if (otp) {
      await this.authService.forgetPasssword(whatsapp, otp, password);
      return response.status(HttpStatus.OK).json({
        message: 'Password berhasil dirubah',
        StatusCode: HttpStatus.OK,
      });
    } else {
      await this.authService.forgetPasssword(whatsapp);
      return response.status(HttpStatus.OK).json({
        message: 'Silahkan cek whatsapp anda untuk mendapatkan kode',
        StatusCode: HttpStatus.OK,
      });
    }
  }

  @ApiExcludeEndpoint()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('auth/2fa/generate')
  async generateQrCode(
    @ActiveUser() ActiveUser: ActiveUserData,
    @Res() response: Response,
  ) {
    const { secret, uri, token } =
      await this.otpAuthenticationService.generateSecret(ActiveUser.username);
    await this.otpAuthenticationService.enableTfaForUser(
      ActiveUser.username,
      token,
      secret,
    );
    // response.status(200).json(secret);
    response.type('png');
    return toFileStream(response, uri);
  }
}
