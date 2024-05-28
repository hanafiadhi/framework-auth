import { registerAs } from '@nestjs/config';

export default registerAs(
  'cache',
  (): Record<string, any> => ({
    redis: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      username: process.env.REDIS_USERNAME || 'default',
      password: process.env.REDIS_PASSWORD || 'CKcJW9U86dAmo',
      ttl: {
        at: process.env.REDIS_AT_TTL || 86400,
        rt: process.env.REDIS_RT_TTL || 259200,
      },
    },
  }),
);
