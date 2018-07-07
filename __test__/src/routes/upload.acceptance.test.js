'use strict';

require('babel-register');

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
  let user2Token;

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
        supertest.post('/signup')
          .send(newerUser)
          .then(response => {
            cookieDough = response.headers['set-cookie'][0];
            user2Token = cookieDough.split('=')[1].split(';')[0];
            done();
          });
        done();
      });
  });

  it('POST /upload  200', () => {

    return supertest.post(`/upload`)
      .set('Authorization', `Bearer ${user1Token}`)
      .field('title', 'batman')
      .attach('img', `${__dirname}/asset/batman.jpg`)
      .then(res => {
        console.log(res.text);
        expect(res.status).toEqual(200);
        expect(res.body.url).toBeTruthy();
      });
    // return supertest.get('/')
    //   .then(res => {
    //     console.log(res.text);
    //   });

    // return supertest.get('/profile')
    //   .then(response => {
    //     console.log(response.text);
    //   });

  });
});