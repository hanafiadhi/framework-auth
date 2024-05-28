import { PartialType } from '@nestjs/mapped-types';
import { SignInDto } from '../../../../iam/authentication/dto/sign-in.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignBody extends PartialType(SignInDto) {
  @ApiProperty({
    required: true,
    description: 'Bisa nomor whatsapp atau yang lain',
    example: '0834567890123',
    minimum: 10,
  })
  username: string;

  @ApiProperty({
    required: true,
    description: 'Silahkan masukan password nda',
    example: 'gundamRx70',
    minimum: 8,
  })
  password: string;

  @ApiProperty({
    required: true,
    description: 'Masukan application yang terdaftar di user',
    example: 'website',
  })
  applications: string;

  @ApiProperty({
    required: false,
    description: 'abaikan saja',
  })
  tfaSecrect: string;
}
