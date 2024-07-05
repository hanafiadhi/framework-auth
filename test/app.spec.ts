import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HealthController } from '../src/health/health.controller';
import { ConfigModule } from '@nestjs/config';

import { IamModule } from '../src/iam/iam.module';
import { HealthModule } from '../src/health/health.module';
import config from '../src/common/config';
import { RmqService } from '../src/providers/queue/rabbbitmq/rmq.service';
import { RmqOptions } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../src/common';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;
  let health: HealthController;
  let jwtToken: string;
  let _id: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    testService = app.get(TestService);
    health = app.get(HealthController);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('should be check Health Check', async () => {
      //   let response = await health.check();
      //   expect(response.status).toBe('ok');
      //   expect(response.info).toBeDefined();
      //   expect(response.info['sa']['status']).toBe('up');
      //   expect(response.info['volunteer']['status']).toBe('up');
      //   expect(response.info['user']['status']).toBe('up');
      //   expect(response.info['redis']['status']).toBe('up');
      //   expect(response.error).toBeDefined();
      //   expect(response['details']).toBeDefined();
    });
  });
});
