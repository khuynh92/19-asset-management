'use strict';
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {type: String, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  profilePic: {type: String},
  images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}],
});

module.exports = mongoose.model('Profile', profileSchema);