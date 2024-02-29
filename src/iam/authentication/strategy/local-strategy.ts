import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authentication.service';
import { SignInDto } from '../dto/sign-in.dto';
import { validate } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthenticationService) {
    super({
      usernameField: 'email', // Menyesuaikan field untuk menggunakan email sebagai username
    });
  }

  //   async validate(email: string, password: string) {
  //     return await this.authService.validateUser(email, password);
  //   }
}
