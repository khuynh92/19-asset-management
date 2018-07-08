'use strict';
require('babel-register');

jest.mock('../../../src/lib/s3.js');
import superr from 'supertest';
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';

const mockgoose = new Mockgoose(mongoose);

const { server } = require('../../../src/app.js');

const supertest = superr(server);

jest.setTimeout(30000);

beforeAll((done) => {
  mockgoose.prepareStorage().then(function () {
    console.log('preparing mockgoose');
    mongoose.connect('mongodb://localhost/lab_19').then(() => done());
  });
});

afterAll((done) => {
  mongoose.disconnect().then(() => {
    console.log('disconnected');
    done();
  }).catch((err) => {
    console.error(err);
    done();
  });
});

afterEach((done) => {
  console.log('resetting');
  mockgoose.helper.reset().then(() => {
    done();
  });
});

describe('acceptance tests', () => {

  let user1Token;
  beforeEach((done) => {
    let newUser = {
      name: 'user',
      username: 'username',
      password: 'password',
      email: 'freemail@email.com',
    };

    let newerUser = {
      name: 'used',
      username: 'nameuser',
      password: 'wordpass',
      email: 'freemail@email.com',
    };

    supertest.post('/signup')
      .send(newUser)
      .then(response => {
        let cookieDough = response.headers['set-cookie'][0];
        user1Token = cookieDough.split('=')[1].split(';')[0];
        done();
      });
  });

  it('POST /upload  200', () => {

    return supertest.post(`/upload`)
      .set('Authorization', `Bearer ${user1Token}`)
      .field('title', 'batman')
      .attach('img', `${__dirname}/asset/batman.jpg`)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.url).toBe('https://mockimagepath.com');
      });

  });

  it('DELETE /image 204', () => {
    return supertest.post(`/upload`)
      .set('Authorization', `Bearer ${user1Token}`)
      .field('title', 'batman')
      .attach('img', `${__dirname}/asset/batman.jpg`)
      .then(res => {
        return supertest.delete('/api/v1/images/' + res.body._id)
          .set('Authorization', `Bearer ${user1Token}`)
          .then(response => {
            expect(response.status).toEqual(204);
          });
      });

  });
});