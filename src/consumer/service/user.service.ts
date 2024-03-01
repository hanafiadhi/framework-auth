import { Inject, Injectable } from '@nestjs/common';
import { UserClientService } from '../use-case/user.use-case';
import { USER_SERVICE } from 'src/common/constants/service-rmq.constant';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto';
import { firstValueFrom } from 'rxjs';
import {
  ChangePassword,
  CreateUser,
  FindByEmail,
  FindById,
  UpdateTfaforUser,
} from 'src/common/message-pattern/user-client.pattern';
import { IUpdateTfaUser } from 'src/common/interface/user-client.interface';

@Injectable()
export class UserService implements UserClientService {
  constructor(@Inject(USER_SERVICE) private readonly userClient: ClientProxy) {}
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
