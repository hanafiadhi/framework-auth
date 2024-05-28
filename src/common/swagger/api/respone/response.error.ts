import { ApiProperty } from '@nestjs/swagger';

export class ErrorUnauthorizedException {
  @ApiProperty({
    description: 'Error ketika Unauthorized',
    example: 'Anda tidak memiliki Hak Access',
  })
  message: string;
  @ApiProperty({
    description: 'status code ketika Unauthorized',
    example: '401',
  })
  statusCode: number;
}

export class ErrorBadRequestExecption {
  @ApiProperty({
    description: 'Berisikan validation yang error',
    example: ['username must be shorter than or equal to 13 characters'],
  })
  message: Array<string>;
  @ApiProperty({
    example: 'Bad Request',
  })
  error: string;
  @ApiProperty({
    description: 'status code ketika Bad Request',
    example: '400',
  })
  statusCode: number;
}
