import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LoginDto } from '../src/auth/dto';
import {
  CreateAutomationDto,
  SubscribeAutomationDto,
} from 'src/automation/dto';

global.console.log = jest.fn();

describe('AppController (e2e)', () => {
  let app: INestApplication;

  describe('server root (e2e)', () => {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect({ message: 'Welcome to the API!', status: 200 });
    });

    it('/about.json (GET)', async () => {
      const resp = await request(app.getHttpServer())
        .get('/about.json')
        .expect(200);

      expect(resp.body.server.current_time).toBeDefined();
      expect(resp.body.server.current_time).toBeGreaterThan(1600000000);
      expect(resp.body.server.services).toBeDefined();
    });
  });

  describe('AuthController (e2e)', () => {
    let req: any;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      req = request(app.getHttpServer());
    });

    afterAll(async () => {
      await app.close();
    });

    it('/auth/login (POST) valid', async () => {
      const dto: LoginDto = {
        email: 'ewen.sellitto@epitech.eu',
        password: 'vsq$12y-uHHG',
      };
      return await req.post('/auth/login').send(dto).expect(200);
    });

    it('/auth/login (POST) invalid password', async () => {
      const dto: LoginDto = {
        email: 'ewen.sellitto@epitech.eu',
        password: 'abcsjh1455cc..Z2A',
      };
      return await req.post('/auth/login').send(dto).expect(403);
    });

    it('/auth/login (POST) empty', async () => {
      const dto: LoginDto = {
        email: '',
        password: '',
      };
      return await req.post('/auth/login').send(dto).expect(403);
    });
  });

  describe('AutomationController (e2e)', () => {
    let app: INestApplication;
    let req: any;
    let token: string;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      req = request(app.getHttpServer());

      const response = await req.post('/auth/login').send({
        email: 'ewen.sellitto@epitech.eu',
        password: 'vsq$12y-uHHG',
      });
      token = response.body.access_token;
    });

    afterEach(async () => {
      await app.close();
    });

    it('/automations (GET)', () => {
      return req
        .get('/automations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('/automations/:id (GET)', () => {
      return req
        .get('/automations/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('/automations/create (POST)', () => {
      const dto: CreateAutomationDto = {
        name: 'web3 and email',
        description: 'hehehee',
        actionId: 2,
        reactionId: 3,
      };
      return req
        .post('/automations/create')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(400);
    });

    it('/automations/:id/subscribe (POST)', () => {
      const dto: SubscribeAutomationDto = {
        actionId: 6,
        reactionId: 2,
        actionAdditionalFields: {},
        reactionAdditionalFields: {
          webhook:
            'https://discord.com/api/webhooks/1161044971172921354/qAKF6QPDkkT5wAC5K8s0jTuHjyHC9yAXqO9pAqh4PZ6D5b-Ijn4bFug5PrBq-F97Vb9k',
        },
      };
      return req
        .post('/automations/1/subscribe')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(404);
    });

    it('/automations/:id/unsubscribe (GET)', () => {
      return req
        .get('/automations/1/unsubscribe')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    it('/automations/:id (DELETE)', () => {
      return req
        .delete('/automations/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
