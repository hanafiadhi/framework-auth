import { PartialType } from '@nestjs/mapped-types';
import {
  SignInDto,
  SignInMobileDto,
} from '../../../../iam/authentication/dto/sign-in.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignBody extends PartialType(SignInDto) {
  @ApiProperty({
    required: true,
    description: 'Bisa nomor whatsapp atau yang lain',
    example: '0834567890123',
    minLength: 4,
    type: String,
  })
  username: string;

  @ApiProperty({
    required: true,
    description: 'Silahkan masukan password anda',
    example: 'gundamRx70',
    minLength: 4,
    type: String,
  })
  password: string;

  @ApiProperty({
    required: true,
    description: 'Masukan application yang terdaftar di user',
    example: 'website',
  })
  applications: string;

  //   @ApiProperty({
  //     required: false,
  //     description: 'abaikan saja',
  //   })
  tfaSecrect?: string;
}

export class SignMobileBody implements SignInMobileDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  device_id?: string;
  @ApiProperty()
  device_brand?: string;
  @ApiProperty()
  device_model?: string;
  @ApiProperty()
  device_manufacture?: string;
  @ApiProperty()
  device_os?: string;
  @ApiProperty()
  device_os_version?: string;
  @ApiProperty()
  application_version?: string;
}
