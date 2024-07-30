import { Injectable } from '@nestjs/common';
import { IUpdateTfaUser } from 'src/common/interface/user-client.interface';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto';
import { ForgetPassword } from '../../iam/authentication/dto/forget-password.dto';

@Injectable()
export abstract class UserClientService {
  abstract findById(_id: string): Promise<any>;
  abstract findByEmail(email: string): Promise<any>;
  abstract createUser(signUpDto: SignUpDto): Promise<any>;
  abstract changePassword(data: {
    _id: string;
    password: string;
  }): Promise<any>;
  abstract updateTfaforUser(payload: IUpdateTfaUser): Promise<any>;
  abstract findByUsername(username: string): Promise<any>;
  abstract updateUser(paylaod: { userId: string; data: any }): Promise<any>;
  abstract forgetPassword(paylaod: ForgetPassword): Promise<any>;
  abstract registerMobile(paylaod: {
    whatsapp: string;
    token?: string;
  }): Promise<any>;

  abstract hardRemove(_id: string): Promise<any>;
}
