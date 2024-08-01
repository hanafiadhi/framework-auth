import { ApiHideProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  whatsapp: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  province_id: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  province_name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  city_id: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city_name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  district_id: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  district_name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  sub_district_id: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sub_district_name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  rt: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  rw: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  tenant_id: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  volunteer_code: string;

  @ApiHideProperty()
  user_id: string;
}
