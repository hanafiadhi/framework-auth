import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { authenticator } from 'otplib';
import { UserClientService } from '../../consumer/use-case/user.use-case';

@Injectable()
export class OtpAuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userClientService: UserClientService,
  ) {}

  async verifyCode(code: string, secret: string, _id?: string) {
    const isValid = authenticator.check(code, secret);
    await this.userClientService.updateTfaforUser({
      _id,
      tfaSecrect: '',
      tfaToken: '',
      isTfaEnable: false,
    });
    return isValid;
  }
  async generateSecret(email: string) {
    const token = authenticator.generateSecret();
    const secret = authenticator.generate(token);
    const appName = this.configService.getOrThrow('TFA_APP_NAME');
    const url = authenticator.keyuri(email, appName, secret);
    return {
      uri: url,
      secret,
      token,
    };
  }

  async enableTfaForUser(email: string, token: string, secret: string) {
    const { _id } = await this.userClientService.findByEmail(email);

    return await this.userClientService.updateTfaforUser({
      _id,
      tfaSecrect: secret,
      tfaToken: token,
      isTfaEnable: true,
    });
  }
}
