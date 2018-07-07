'use strict';

import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  title: {type: String, required: true},
  url: {type: String, required: true, unique: true},
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Image', imageSchema);