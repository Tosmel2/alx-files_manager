/* eslint-disable jest/no-identical-title */
import { expect, use, should } from 'chai';
import chaiHttp from 'chai-http';
import { promisify } from 'util';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

use(chaiHttp);
should();

// redisClient

describe('testing the clients for MongoDB and Redis', () => {
  describe('redis Client', () => {
    // eslint-disable-next-line no-undef
    before(async () => {
      await redisClient.client.flushall('ASYNC');
    });

    // eslint-disable-next-line no-undef
    after(async () => {
      await redisClient.client.flushall('ASYNC');
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('shows that connection is alive', async () => {
      // eslint-disable-next-line jest/valid-expect
      expect(redisClient.isAlive()).to.equal(true);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('returns key as null because it does not exist', async () => {
      // eslint-disable-next-line jest/valid-expect
      expect(await redisClient.get('myKey')).to.equal(null);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('set key can be called without issue', async () => {
      // eslint-disable-next-line jest/valid-expect
      expect(await redisClient.set('myKey', 12, 1)).to.equal(undefined);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('returns key with null because it expired', async () => {
      const sleep = promisify(setTimeout);
      await sleep(1100);
      // eslint-disable-next-line jest/valid-expect
      expect(await redisClient.get('myKey')).to.equal(null);
    });
  });

  // dbClient
  describe('db Client', () => {
    // eslint-disable-next-line no-undef
    before(async () => {
      await dbClient.usersCollection.deleteMany({});
      await dbClient.filesCollection.deleteMany({});
    });
    // eslint-disable-next-line no-undef
    after(async () => {
      await dbClient.usersCollection.deleteMany({});
      await dbClient.filesCollection.deleteMany({});
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('shows that connection is alive', () => {
      // eslint-disable-next-line jest/valid-expect
      expect(dbClient.isAlive()).to.equal(true);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('shows that connection is alive', () => {
      // eslint-disable-next-line jest/valid-expect
      expect(dbClient.isAlive()).to.equal(true);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('shows number of user documents', async () => {
      await dbClient.usersCollection.deleteMany({});
      // eslint-disable-next-line jest/valid-expect
      expect(await dbClient.nbUsers()).to.equal(0);

      await dbClient.usersCollection.insertOne({ name: 'Larry' });
      await dbClient.usersCollection.insertOne({ name: 'Karla' });
      // eslint-disable-next-line jest/valid-expect
      expect(await dbClient.nbUsers()).to.equal(2);
    });

    // eslint-disable-next-line jest/prefer-expect-assertions
    it('shows number of file documents', async () => {
      await dbClient.filesCollection.deleteMany({});
      // eslint-disable-next-line jest/valid-expect
      expect(await dbClient.nbFiles()).to.equal(0);

      await dbClient.filesCollection.insertOne({ name: 'FileOne' });
      await dbClient.filesCollection.insertOne({ name: 'FileTwo' });
      // eslint-disable-next-line jest/valid-expect
      expect(await dbClient.nbUsers()).to.equal(2);
    });
  });
});
