import { registerAs } from '@nestjs/config';

export default registerAs(
  'swagger',
  (): Record<string, any> => ({
    config: {
      info: {
        title: '{Grouping by Repo}-{ngikutin kata}-Aggregation',
        setDescription: 'Deskripsi Aplikasi Anda',
        setVersion: '1.0',
        setTermsOfService: 'https://example.com/terms',
        setContact: `'John Doe', 'john@example.com', 'https://example.com/contact'`,
        setLicense: `'MIT', 'https://example.com/license'`,
        // .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }),
        // .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }),
        // .addBasicAuth({ type: 'http', scheme: 'basic' }),
        // .addOAuth2({
        //   type: 'oauth2',
        //   flows: {
        //     implicit: { authorizationUrl: 'https://example.com/auth', scopes: {} },
        //   },
        // })
        addTag: `'Endpoints', 'Kumpulan endpoint aplikasi'`,
        // addServer('https://api.example.com', 'Production Server')
        // addServer('http://localhost:3000', 'Local Server')
      },
      swaggerUI: process.env.SWAGGER_ENABLED === 'true' ? true : false,
      documentationPath: '/auth/docs',
      documentationJson: '/auth/docs-json',
      swaggerPassword: process.env.SWAGGER_PASSWORD,
      swaggerUser: process.env.SWAGGER_USER,
    },
    options: {
      apisSorter: 'alpha',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    localUrl: process.env.SWAGGER_LOCAL_SERVER ?? 'http://localhost:3000',
    develompentUrl:
      process.env.SWAGGER_DEVELOPMENT_SERVER ?? 'https://example.com',
    productionUrl:
      process.env.SWAGGER_PRODUCTION_SERVER ?? 'https://example.com',
  }),
);
