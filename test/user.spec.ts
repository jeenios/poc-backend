import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
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
  describe('POST /api/users', () => {
    // sebelum setiap test, hapus user test
    beforeEach(async () => {
      await testService.deleteUser();
    });

    // register user with invalid request
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });

      // dipanggilnya gini
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    // register user with valid request
    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'alilatukau',
          password: 'testpassword',
          name: 'Ali Latukau',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('alilatukau');
      expect(response.body.data.name).toBe('Ali Latukau');
    });

    it('should be rejected if user already exists', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'alilatukau',
          password: 'testpassword',
          name: 'Ali Latukau',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  // testing untuk login
  describe('POST /api/users/login', () => {
    // sebelum setiap test, hapus user test
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    // register user with invalid request
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        });

      // dipanggilnya gini
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    // login user with valid request
    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'alilatukau',
          password: 'testpassword',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('alilatukau');
      expect(response.body.data.name).toBe('Ali Latukau');
      expect(response.body.data.token).toBeDefined();
    });
  });

  // testing untuk get user profile
  describe('GET /api/users/current', () => {
    // sebelum setiap test, hapus user test
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    // get user profile with invalid request
    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'wrong');

      // dipanggilnya gini
      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    // get user profile with valid request
    it('should be able to get user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'testtoken');

      // dipanggilnya gini
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('alilatukau');
      expect(response.body.data.name).toBe('Ali Latukau');
    });
  });

  // testing untuk udpate user
  describe('PATCH /api/users/current', () => {
    // sebelum setiap test, hapus user test
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    // update user with invalid request
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'testtoken')
        .send({
          name: '',
          password: '',
        });

      // dipanggilnya gini
      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    // update user with valid request
    it('should be able to update user', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'testtoken')
        .send({
          name: 'Ali Latukau Updated',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('alilatukau');
      expect(response.body.data.name).toBe('Ali Latukau Updated');
    });

    // update password with valid request
    it('should be able to update user password', async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'testtoken')
        .send({
          password: 'newpassword',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('alilatukau');
      expect(response.body.data.name).toBe('Ali Latukau');

      response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'alilatukau',
          password: 'newpassword',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.token).toBeDefined();
    });
  });

  // testing untuk logout user
  describe('DELETE /api/users/current', () => {
    // sebelum setiap test, hapus user test
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    // logout user with invalid request
    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', 'wrong');

      // dipanggilnya gini
      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    // logout user with valid request
    it('should be able to logout user', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', 'testtoken');

      // dipanggilnya gini
      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      // cek apakah user sudah logout
      const user = await testService.getUser();
      expect(user?.token).toBeNull();
    });
  });
});
