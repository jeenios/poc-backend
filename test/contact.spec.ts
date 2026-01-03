import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ContactController', () => {
  let app: INestApplication;
  let logger: Logger;
  // ini buat test service yang isinya delete user
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);

    // ini buat loggernya
    logger = app.get(WINSTON_MODULE_PROVIDER);
  });

  // testing untuk register
  describe('POST /api/contacts', () => {
    // sebelum setiap test, hapus user test
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
    });

    // create contact with invalid request
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'testtoken')
        .send({
          first_name: '',
          last_name: '',
          email: 'salah',
          phone: '',
        });

      // dipanggilnya gini
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    // create contact with valid request
    it('should be able to create contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'testtoken')
        .send({
          first_name: 'Ali',
          last_name: 'Latukau',
          email: 'alilatukau@example.com',
          phone: '081234567890',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe('Ali');
      expect(response.body.data.last_name).toBe('Latukau');
      expect(response.body.data.email).toBe('alilatukau@example.com');
      expect(response.body.data.phone).toBe('081234567890');
    });
  });

  // testing untuk get contact
  describe('GET /api/contacts/:contactId', () => {
    // sebelum setiap test, hapus user test
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
    });

    // get contact with invalid request
    it('should be rejected if contact not found', async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact!.id + 1}`)
        .set('Authorization', 'testtoken');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    // get contact with valid request
    it('should be able to get contact', async () => {
      const contact = await testService.getContact();

      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact?.id}`)
        .set('Authorization', 'testtoken');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe('Ali');
      expect(response.body.data.last_name).toBe('Latukau');
      expect(response.body.data.email).toBe('alilatukau@example.com');
      expect(response.body.data.phone).toBe('081234567890');
    });
  });
});
