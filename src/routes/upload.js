'use strict';

import fs from 'fs';
import express from 'express';
import multer from 'multer';
import s3 from '../lib/s3.js';

import auth from '../auth/auth.js';
import Profile from '../models/profile.js';
import Image from '../models/image.js';
const upload = multer({ dest: `${__dirname}/../tmp` });

const uploadRouter = express.Router();

uploadRouter.get('/', (req, res, next) => {
  fs.readFile(__dirname + '/../../public/index.html', (err, data) => {
    if (err) { next(err); }

    res.write(data);
    res.status(200);
    res.end();

  });
});

uploadRouter.post('/upload', auth, upload.any(), (req, res, next) => {
  if (!req.body.title || req.files.length > 1 || req.files[0].fieldname !== 'img') {
    return next('title or sample was not provided');
  }

  if (req.id) {
    console.log(req.id);
    let file = req.files[0];
    let key = `${file.filename}.${file.originalname}`;

    return s3.upload(file.path, key)
      .then(url => {
        Image.create({
          title: req.body.title,
          url: url,
          userID: req.id,
        })
          .then(newImage => {
            Profile.findOne({userID: req.id})
              .then(user => {
                user.images.push(newImage._id);
                user.save()
                  .then(() => {
                    res.send(newImage);
                  })
                  .catch(next);
              });
          })
          .catch(next);
      })
      .catch(next);
  }
});

export default uploadRouter;