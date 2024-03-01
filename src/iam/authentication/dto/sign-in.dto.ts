import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  tfaSecrect: string;
}
