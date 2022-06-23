/* eslint-disable jest/valid-expect */
/* eslint-disable no-unused-expressions */
import {
  expect, use, should, request,
} from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { ObjectId } from 'mongodb';
import app from '../server';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

use(chaiHttp);
should();

// User Endpoints ==============================================

describe('testing User Endpoints', () => {
  const credentials = 'Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=';
  let token = '';
  let userId = '';
  const user = {
    email: 'bob@dylan.com',
    password: 'toto1234!',
  };

  // eslint-disable-next-line no-undef
  before(async () => {
    await redisClient.client.flushall('ASYNC');
    await dbClient.usersCollection.deleteMany({});
    await dbClient.filesCollection.deleteMany({});
  });

  // eslint-disable-next-line no-undef
  after(async () => {
    await redisClient.client.flushall('ASYNC');
    await dbClient.usersCollection.deleteMany({});
    await dbClient.filesCollection.deleteMany({});
  });

  // users
  describe('pOST /users', () => {
    // eslint-disable-next-line jest/prefer-expect-assertions
    it('returns the id and email of created user', async () => {
      const response = await request(app).post('/users').send(user);
      const body = JSON.parse(response.text);
      // eslint-disable-next-line jest/valid-expect
      expect(body.email).to.equal(user.email);
      // eslint-disable-next-line jest/valid-expect
      expect(body).to.have.property('id');
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(201);

      userId = body.id;
      const userMongo = await dbClient.usersCollection.findOne({
        _id: ObjectId(body.id),
      });
      // eslint-disable-next-line jest/valid-expect
      expect(userMongo).to.exist;
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('fails to create user because password is missing', async () => {
      const user = {
        email: 'bob@dylan.com',
      };
      const response = await request(app).post('/users').send(user);
      const body = JSON.parse(response.text);
      // eslint-disable-next-line jest/valid-expect
      expect(body).to.eql({ error: 'Missing password' });
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(400);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('fails to create user because email is missing', async () => {
      const user = {
        password: 'toto1234!',
      };
      const response = await request(app).post('/users').send(user);
      const body = JSON.parse(response.text);
      expect(body).to.eql({ error: 'Missing email' });
      expect(response.statusCode).to.equal(400);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('fails to create user because it already exists', async () => {
      const user = {
        email: 'bob@dylan.com',
        password: 'toto1234!',
      };
      const response = await request(app).post('/users').send(user);
      const body = JSON.parse(response.text);
      // eslint-disable-next-line jest/valid-expect
      expect(body).to.eql({ error: 'Already exist' });
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(400);
    });
  });

  // Connect

  describe('gET /connect', () => {
    // eslint-disable-next-line jest/prefer-expect-assertions
    it('fails if no user is found for credentials', async () => {
      const response = await request(app).get('/connect').send();
      const body = JSON.parse(response.text);
      // eslint-disable-next-line jest/valid-expect
      expect(body).to.eql({ error: 'Unauthorized' });
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(401);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('returns a token if user is for credentials', async () => {
      const spyRedisSet = sinon.spy(redisClient, 'set');

      const response = await request(app)
        .get('/connect')
        .set('Authorization', credentials)
        .send();
      const body = JSON.parse(response.text);
      token = body.token;
      // eslint-disable-next-line jest/valid-expect
      expect(body).to.have.property('token');
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(200);
      // eslint-disable-next-line no-unused-expressions
      expect(
        spyRedisSet.calledOnceWithExactly(`auth_${token}`, userId, 24 * 3600),
      // eslint-disable-next-line jest/valid-expect
      ).to.be.true;

      spyRedisSet.restore();
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('token exists in redis', async () => {
      const redisToken = await redisClient.get(`auth_${token}`);
      // eslint-disable-next-line jest/valid-expect
      expect(redisToken).to.exist;
    });
  });

  // Disconnect

  describe('gET /disconnect', () => {
    // eslint-disable-next-line no-undef
    after(async () => {
      await redisClient.client.flushall('ASYNC');
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('should responde with unauthorized because there is no token for user', async () => {
      const response = await request(app).get('/disconnect').send();
      const body = JSON.parse(response.text);
      // eslint-disable-next-line jest/valid-expect
      expect(body).to.eql({ error: 'Unauthorized' });
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(401);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('should sign-out the user based on the token', async () => {
      const response = await request(app)
        .get('/disconnect')
        .set('X-Token', token)
        .send();
        // eslint-disable-next-line jest/valid-expect
      expect(response.text).to.be.equal('');
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(204);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('token no longer exists in redis', async () => {
      const redisToken = await redisClient.get(`auth_${token}`);
      // eslint-disable-next-line no-unused-expressions
      expect(redisToken).to.not.exist;
    });
  });

  describe('gET /users/me', () => {
    // eslint-disable-next-line no-undef
    before(async () => {
      const response = await request(app)
        .get('/connect')
        .set('Authorization', credentials)
        .send();
      const body = JSON.parse(response.text);
      token = body.token;
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('should return unauthorized because no token is passed', async () => {
      const response = await request(app).get('/users/me').send();
      const body = JSON.parse(response.text);
      // eslint-disable-next-line jest/valid-expect
      expect(body).to.be.eql({ error: 'Unauthorized' });
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(401);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('should retrieve the user base on the token used', async () => {
      const response = await request(app)
        .get('/users/me')
        .set('X-Token', token)
        .send();
      const body = JSON.parse(response.text);

      // eslint-disable-next-line jest/valid-expect
      expect(body).to.be.eql({ id: userId, email: user.email });
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(200);
    });
  });
});