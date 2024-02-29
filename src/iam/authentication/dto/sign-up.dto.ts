import {
  IsEmail,
  IsIn,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsInt()
  @Min(18)
  age: number;

  @IsNotEmpty()
  @IsMongoId()
  province: string;

  @IsNotEmpty()
  @IsString()
  province_name: string;

  @IsNotEmpty()
  @IsMongoId()
  city: string;

  @IsNotEmpty()
  @IsString()
  city_name: string;

  @IsNotEmpty()
  @IsMongoId()
  district: string;

  @IsNotEmpty()
  @IsString()
  district_name: string;

  @IsNotEmpty()
  @IsMongoId()
  sub_district: string;

  @IsNotEmpty()
  @IsString()
  sub_district_name: string;
}
