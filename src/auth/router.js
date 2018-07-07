'use strict';

import express from 'express';
import fs from 'fs';
const authRouter = express.Router();

import User from './users.js';
import auth from './auth.js';
import oauth from './lib/oauth.js';
import Profile from './../models/profile.js';

authRouter.post('/signup', (req, res, next) => {
  if(!Object.keys(req.body).length) {
    next(400);
  }
  let user = new User(req.body);
  user.save()
    .then(user => {
      let token = user.generateToken();
      res.cookie('auth', token);
      Profile.create({
        name: req.body.name,
        userID: user._id,
      })
        .then(() => {
          res.redirect(`${process.env.API_URL}/profile/${user._id}`);
        });
    })
    .catch(next);
});

authRouter.get('/signin', auth, (req, res) => {
  res.cookie('auth', req.token);
  res.redirect(`${process.env.API_URL}/profile/${req.id}`);
});

authRouter.get('/oauth/google/code', (req,res,next) => {
  oauth.authorize(req)
    .then(token => {
      res.cookie('auth', token);
      res.redirect(`${process.env.API_URL}/profile/${req.id}`);
    })
    .catch(next);
});

authRouter.get('/newUser', auth, (req,res,next) => {
  if (req.id) {
    fs.readFile(__dirname + '/../../public/newUser.html', (err, data) => {
      if (err) { next(err); }
  
      res.write(data);
      res.status(200);
      res.end();
  
    });
  }
});


export default authRouter;
