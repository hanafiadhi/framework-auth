import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto';

@Injectable()
export abstract class UserClientService {
  abstract findById(_id: string): Promise<any>;
  abstract findByEmail(email: string): Promise<any>;
  abstract createUser(signUpDto: SignUpDto): Promise<any>;
  abstract changePassword(data: {
    _id: string;
    password: string;
  }): Promise<any>;
}
