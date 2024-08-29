import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './iam/iam.module';

import config from '@app/common/config';
import { HealthModule } from './health/health.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
      cache: true,
      ignoreEnvFile: false,
      envFilePath: ['.env'],
    }),
    IamModule,
    HealthModule,
  ],
})
export class AppModule {}
