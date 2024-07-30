import { Inject, Injectable } from '@nestjs/common';
import { UserClientService } from '../use-case/user.use-case';

import { ClientProxy } from '@nestjs/microservices';

import { firstValueFrom } from 'rxjs';
import { USER_SERVICE } from '../../common';
import {
  ChangePassword,
  CreateUser,
  FindByEmail,
  FindById,
  FindByUsername,
  UpdateTfaforUser,
} from '../../common/message-pattern/user-client.pattern';
import { IUpdateTfaUser } from '../../common/interface/user-client.interface';
import { SignUpDto } from '../../iam/authentication/dto/sign-up.dto';
import { ForgetPassword } from '../../iam/authentication/dto/forget-password.dto';

@Injectable()
export class UserService implements UserClientService {
  constructor(@Inject(USER_SERVICE) private readonly userClient: ClientProxy) {}

  async hardRemove(_id: string): Promise<any> {
    return await firstValueFrom(
      this.userClient.emit('delete-user-many', { _id }),
    );
  }

  async registerMobile(paylaod: {
    whatsapp: string;
    token?: string;
  }): Promise<any> {
    return await firstValueFrom(
      this.userClient.send('register-mobile', paylaod),
    );
  }

  async forgetPassword(paylaod: ForgetPassword): Promise<any> {
    return await firstValueFrom(
      this.userClient.send('forget-password', paylaod),
    );
  }

  async updateUser(paylaod: { userId: string; data: any }): Promise<any> {
    return await firstValueFrom(this.userClient.emit('update-user', paylaod));
  }

  async findByUsername(username: string): Promise<any> {
    return await firstValueFrom(this.userClient.send(FindByUsername, username));
  }
  async updateTfaforUser(payload: IUpdateTfaUser): Promise<any> {
    return await firstValueFrom(
      this.userClient.send(UpdateTfaforUser, payload),
    );
  }

  async createUser(signUpDto: SignUpDto): Promise<any> {
    return await firstValueFrom(this.userClient.send(CreateUser, signUpDto));
  }
  async findById(_id: string): Promise<any> {
    return await firstValueFrom(this.userClient.send(FindById, _id));
  }
  async findByEmail(email: string): Promise<any> {
    return await firstValueFrom(this.userClient.send(FindByEmail, email));
  }

  async changePassword(data: { _id: string; password: string }): Promise<any> {
    return await firstValueFrom(this.userClient.send(ChangePassword, data));
  }
}
