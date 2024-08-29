import { ApiHideProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
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

  @IsNotEmpty()
  @IsString()
  tenant_id: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  volunteer_code: string;

  @IsOptional()
  @IsMongoId()
  assignment_province_id?: string;

  @IsOptional()
  @IsString()
  assignment_province_name?: string;

  @IsOptional()
  @IsMongoId()
  assignment_city_id?: string | null;

  @IsOptional()
  @IsString()
  assignment_city_name?: string | null;

  @IsOptional()
  @IsMongoId()
  assignment_district_id?: string | null;

  @IsOptional()
  @IsString()
  assignment_district_name?: string | null;

  @IsOptional()
  @IsMongoId({ each: true })
  assignment_sub_district_id?: string[] | null;

  @IsOptional()
  @IsString({ each: true })
  assignment_sub_district_name?: string[] | null;

  @IsOptional()
  @IsString()
  assignment_rw?: string;

  @IsOptional()
  @IsString()
  assignment_rt?: string;

  @IsOptional()
  @IsString()
  assignment_tps?: string;

  @ApiHideProperty()
  user_id: string;

  @ApiHideProperty()
  is_canvassing: boolean;
}
