import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(13)
  username: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  applications: string;

  tfaSecrect?: string;
}

export class SignInMobileDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(13)
  username: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  password: string;

  @IsNotEmpty()
  @IsString()
  device_id?: string;

  @IsNotEmpty()
  @IsString()
  device_brand?: string;

  @IsNotEmpty()
  @IsString()
  device_model?: string;

  @IsNotEmpty()
  @IsString()
  device_manufacture?: string;

  @IsNotEmpty()
  @IsString()
  device_os?: string;

  @IsNotEmpty()
  @IsString()
  device_os_version?: string;

  @IsNotEmpty()
  @IsString()
  application_version?: string;
}
