import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

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

  tfaSecrect: string;
}
