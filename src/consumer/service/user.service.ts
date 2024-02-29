import { Inject, Injectable } from '@nestjs/common';
import { UserClientService } from '../use-case/user.use-case';
import { USER_SERVICE } from 'src/common/constants/service-rmq.constant';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto';
import { firstValueFrom } from 'rxjs';
import {
  changePassword,
  createUser,
  findByEmail,
  findById,
} from 'src/common/message-pattern/user-client.pattern';

@Injectable()
export class UserService implements UserClientService {
  constructor(@Inject(USER_SERVICE) private readonly userClient: ClientProxy) {}
  async createUser(signUpDto: SignUpDto): Promise<any> {
    return await firstValueFrom(this.userClient.send(createUser, signUpDto));
  }
  async findById(_id: string): Promise<any> {
    return await firstValueFrom(this.userClient.send(findById, _id));
  }
  async findByEmail(email: string): Promise<any> {
    return await firstValueFrom(this.userClient.send(findByEmail, email));
  }

  async changePassword(data: { _id: string; password: string }): Promise<any> {
    return await firstValueFrom(this.userClient.send(changePassword, data));
  }
}
