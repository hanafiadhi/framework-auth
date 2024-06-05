import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authentication.service';

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
