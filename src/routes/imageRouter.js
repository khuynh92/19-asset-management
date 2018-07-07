'use strict';

import express from 'express';
const router = express.Router();

import auth from '../auth/auth.js';
import Image from '../models/image.js';
import s3 from '../lib/s3.js';

router.get('/api/v1/images', auth, (req, res, next) => {
  if (req.id) {
    Image.find({ userID: req.id })
      .then(response => {
        res.send(response);
      })
      .catch(next);
  } else {
    next('Unauthorized');
  }
});

router.get('/api/v1/images/:id', auth, (req, res, next) => {
  if (req.id) {
    Image.findById(req.params.id)
      .then(response => {
        if (response === null) {
          next();
        }
        if (JSON.stringify(response.userID) === JSON.stringify(req.id)) {
          res.send(response);
        } else {
          next('Unauthorized');
        }
      })
      .catch(() => {
        next();
      });
  } else {
    next('Unauthorized');
  }
});

router.delete('/api/v1/images/:id', auth, (req, res, next) => {
  if (req.id) {
    Image.findById(req.params.id)
      .then(response => {
        if (response === null) {
          next();
        }
        if (JSON.stringify(response.userID) === JSON.stringify(req.id)) {
          Image.findByIdAndRemove(req.params.id)
            .then(data => {
              let key = data.url.split('com/')[1];
              s3.remove(key)
                .then(() => {
                  res.send(`${req.params.id} has been successfully removed`);
                });
            });
        } else {
          next('Unauthorized');
        }
      })
      .catch(() => {
        next();
      });
  } else {
    next('Unauthorized');
  }
});

export default router;