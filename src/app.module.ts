import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './iam/iam.module';

import config from '@app/common/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
      cache: true,
      ignoreEnvFile: false,
      envFilePath: ['./env/.env.development'],
    }),
    IamModule,
  ],
})
export class AppModule {}
