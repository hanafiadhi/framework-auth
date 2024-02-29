import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as basicAuth from 'express-basic-auth';
// import * as csurf from 'csurf';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentSwagger } from './common/swagger/document/document';
import { AUTH_SERVICE } from './common/constants/service-rmq.constant';
import { RmqService } from './providers/queue/rabbbitmq/rmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(helmet());
  //   app.use(csurf());
  const configService = app.get(ConfigService);
  const env: string = configService.get<string>('app.appEnv');
  const appName: string = configService.get<string>('app.appName');

  const swaggerConfig: any = configService.get<any>('swagger.config');
  const swaggerPath = swaggerConfig.documentationPath;
  const rmqService = app.get<RmqService>(RmqService);
  const micto = app.connectMicroservice(
    rmqService.getOptions(AUTH_SERVICE, true),
  );

  const ga = await app.startAllMicroservices();

  let swaggerUrl: string;
  if (swaggerConfig.swaggerUI === true) {
    app.use(
      [`${swaggerPath}`, `${swaggerConfig.documentationJson}`],
      basicAuth({
        challenge: true,
        users: {
          [`${swaggerConfig.swaggerUser}`]: swaggerConfig.swaggerPassword,
        },
      }),
    );
    const document = SwaggerModule.createDocument(
      app,
      new DocumentSwagger(configService).Builder(),
    );

    const swaggerOptions = configService.get<any>('plugin.swagger.options');
    SwaggerModule.setup(`${swaggerPath}`, app, document, {
      swaggerOptions: swaggerOptions,
    });
  }
  await app.listen(
    configService.get('app.port.api'),
    configService.get('app.host'),
  );
  const appUrl = await app.getUrl();
  console.log(`\n`);
  console.log(`APP NAME\t: ${appName}`);
  console.log(`ENVIRONMENT\t: ${env}`);
  console.log(`RUNNING ON \t: ${appUrl}`);
  console.log(`SWAGGER UI\t: ${appUrl}${swaggerPath}`);
}
bootstrap();
