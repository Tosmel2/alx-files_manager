import {
  expect, use, should, request,
} from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import dbClient from '../utils/db';

use(chaiHttp);
should();

// General APP Endpoints ==============================================

describe('testing App Status Endpoints', () => {
  describe('gET /status', () => {
    // eslint-disable-next-line jest/prefer-expect-assertions
    it('returns the status of redis and mongo connection', async () => {
      const response = await request(app).get('/status').send();
      const body = JSON.parse(response.text);

      // eslint-disable-next-line jest/valid-expect
      expect(body).to.eql({ redis: true, db: true });
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(200);
    });
  });

  describe('gET /stats', () => {
    // eslint-disable-next-line no-undef
    before(async () => {
      await dbClient.usersCollection.deleteMany({});
      await dbClient.filesCollection.deleteMany({});
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('returns number of users and files in db 0 for this one', async () => {
      const response = await request(app).get('/stats').send();
      const body = JSON.parse(response.text);

      // eslint-disable-next-line jest/valid-expect
      expect(body).to.eql({ users: 0, files: 0 });
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(200);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('returns number of users and files in db 1 and 2 for this one', async () => {
      await dbClient.usersCollection.insertOne({ name: 'Larry' });
      await dbClient.filesCollection.insertOne({ name: 'image.png' });
      await dbClient.filesCollection.insertOne({ name: 'file.txt' });

      const response = await request(app).get('/stats').send();
      const body = JSON.parse(response.text);

      // eslint-disable-next-line jest/valid-expect
      expect(body).to.eql({ users: 1, files: 2 });
      // eslint-disable-next-line jest/valid-expect
      expect(response.statusCode).to.equal(200);
    });
  });
});
