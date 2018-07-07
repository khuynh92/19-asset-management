'use strict';

import express from 'express';
const router = express.Router();

import auth from '../auth/auth.js';
import Profile from './../models/profile.js';

router.get('/profile/:id', auth, (req, res, next) => {
  Profile.find({userID: req.params.id})
    .populate({path:'images', select: 'title url'})
    .then(user => {
      res.send(user);
    })
    .catch(next);
});

router.get('/profile', auth, (req, res, next) => {
  if(req.id) {
    res.redirect(`${process.env.API_URL}/profile/${req.id}`);
  } else {
    next('redirect error');
  }
});

export default router;