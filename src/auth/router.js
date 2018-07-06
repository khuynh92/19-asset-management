'use strict';

import express from 'express';

const authRouter = express.Router();

import User from './users.js';
import auth from './auth.js';
import oauth from './lib/oauth.js';

authRouter.post('/signup', (req, res, next) => {
  if(!Object.keys(req.body).length) {
    next(400);
  }
  let user = new User(req.body);
  user.save()
    .then(user => {
      res.send(user.generateToken());
    })
    .catch(next);
});

authRouter.get('/signin', auth, (req, res) => {
  res.cookie('Token', req.token);
  res.send(req.token);
});

authRouter.get('/oauth/google/code', (req,res,next) => {
  oauth.authorize(req)
    .then(token => {
      res.cookie('auth', token);
      res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
    })
    .catch(next);
});

authRouter.get('/open', auth, (req,res) => {
  console.log(req.query.token);
  
  res.send('Sesame');
});

export default authRouter;
