import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../src/common/prisma.service';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    prismaService = app.get(PrismaService);

    await prismaService.user.deleteMany();
  });

  describe('POST /api/users', () => {
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: '',
          password: '',
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    // it('should be able to register', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/api/users/register')
    //     .send({
    //       username: 'testuser',
    //       password: 'testpassword',
    //       name: 'Test User',
    //     });

    //   expect(response.status).toBe(201);
    //   expect(response.body.data.username).toBe('testuser');
    //   expect(response.body.data.name).toBe('Test User');
    // });
  });
});
