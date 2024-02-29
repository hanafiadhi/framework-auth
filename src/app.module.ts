import { Module } from '@nestjs/common';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';

import config from './common/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
      cache: true,
      ignoreEnvFile: false,
    }),
    IamModule,
  ],
})
export class AppModule {}
