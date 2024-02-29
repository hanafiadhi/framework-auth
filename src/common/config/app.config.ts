import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    appEnv: process.env.APP_ENV || 'dev',
    host: process.env.APP_HOST || '0.0.0.0',
    port: {
      api: process.env.APP_PORT || 3000,
    },
    appName: process.env.APP_NAME || 'canvas-aggregation-auth',
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    googleCloud: process.env.GOOGLE_CLOUD,
    bucketGcpAuth: process.env.BUCKET_GCP_AUTH
  }),
);
