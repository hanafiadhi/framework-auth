import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HealthController } from '../src/health/health.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let health: HealthController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    health = app.get(HealthController);
    await app.init();
  });

  describe('Health Check', () => {
    it('should be check Health Check', async () => {
      let response = await health.check();
      expect(response.status).toBe('ok');
      expect(response.info).toBeDefined();
      expect(response.info['auth']['status']).toBe('up');
      expect(response.error).toBeDefined();
      expect(response['details']).toBeDefined();
    });
  });
});
