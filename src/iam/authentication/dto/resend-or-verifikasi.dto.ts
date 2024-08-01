import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResendOrVerif {
  @IsNotEmpty()
  @IsNumberString()
  whatsapp: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  token: string;
}
