import { Injectable } from '@nestjs/common';

import { UserClientService } from '../src/consumer/use-case/user.use-case';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestService {
  /**
   * This Constructornya harus diisi dengan queuenya
   */
  private url;

  constructor(
    private readonly userClientService: UserClientService,
    private readonly configService: ConfigService,
  ) {
    if (configService.get('app.appEnv') == 'local') {
      this.url = 'http://127.0.0.1';
    }

    if (configService.get('app.appEnv') == 'dev') {
      this.url = configService.get('swagger.config.develompentUrl');
    }

    if (configService.get('app.appEnv') == 'prod') {
      this.url = configService.get('swagger.config.productionUrl');
    }
  }
  //   removeVolunter(payload: object) {
  //     return this.volunteerClientService.removeMany(payload);
  //   }
  //   removeUser(payload: object) {
  //     return this.userClientService.removeMany(payload);
  //   }

  //   async checkLogin(credentials: {
  //     username: string;
  //     password: string;
  //     applications: string;
  //   }) {
  //     try {
  //       const response = await axios.post(
  //         `${this.url}:3000/v1/auth/login`,
  //         credentials,
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error('Login error:', error);
  //       throw error;
  //     }
  //   }
}
