import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ForgetPassword {
  @IsNotEmpty()
  @IsString()
  whatsapp: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  otp?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  confirm_password?: string;
}
