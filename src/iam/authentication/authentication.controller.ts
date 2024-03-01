import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Response, response } from 'express';
import { AccessTokenGuard } from './guard/access-token.guard';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserData } from 'src/common/interface/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { TokenExpiredError } from '@nestjs/jwt';
import { OtpAuthenticationService } from './otp-authentication.service';
import { toFileStream } from 'qrcode';

@ApiTags('Authentication')
@Controller({ version: '1' })
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
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
      throw new RpcException(new UnauthorizedException().getResponse());
    }
  }

  @Post('/auth/register')
  async signUp(
    @Res({ passthrough: true }) response: Response,
    @Body() signUpDto: SignUpDto,
  ) {
    await this.authService.signUp(signUpDto);
    response.status(HttpStatus.CREATED).json({
      message: 'Selamat Anda Berhasil Membuat Akun',
      StatusCode: HttpStatus.CREATED,
    });
  }

  //   @UseGuards(LocalAuthGuard)
  @ApiBearerAuth('jwt')
  @UseGuards(AccessTokenGuard)
  @Post('auth/health')
  async health(@ActiveUser() user: ActiveUserData, @Req() req) {
    return true;
    // return await this.authService.signIp(signInpDto);
    // response.cookie('accessToken', accToken, {
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: true,
    // });
    // return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  async signInv2(@Body() signIn: SignInDto) {
    return await this.authService.signIn(signIn);
  }

  @HttpCode(HttpStatus.OK)
  @Post('auth/refresh-token')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('jwt')
  @UseGuards(AccessTokenGuard)
  @Post('auth/logout')
  async logout() {
    throw new NotImplementedException('Under Contstruction');
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('jwt')
  @UseGuards(AccessTokenGuard)
  @Post('auth/change-password')
  async changePassword(
    @Res({ passthrough: true }) response: Response,
    @ActiveUser() user: ActiveUserData,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(changePasswordDto, user.sub);
    response.status(HttpStatus.OK).json({
      message: 'Password berhasil dirubah',
      StatusCode: HttpStatus.OK,
    });
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('auth/2fa/generate')
  async generateQrCode(
    @ActiveUser() ActiveUser: ActiveUserData,
    @Res() response: Response,
  ) {
    const { secret, uri, token } =
      await this.otpAuthenticationService.generateSecret(ActiveUser.email);
    await this.otpAuthenticationService.enableTfaForUser(
      ActiveUser.email,
      token,
      secret,
    );
    // response.status(200).json(secret);
    response.type('png');
    return toFileStream(response, uri);
  }
}
