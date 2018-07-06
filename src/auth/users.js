'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});

userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashed => {
      this.password = hashed;
      next();
    })
    .catch(err => { throw err; });
});

userSchema.statics.createFromOAuth = function(googleUser) {
  if(!googleUser || !googleUser.email) {
    return Promise.reject('VALIDATION ERROR: missing username/email or password');
  }

  return this.findOne({email:googleUser.email})
    .then(user => {
      if(!user) { throw new Error ('User Not Found'); }
      console.log('Welcome Back!', user.username);
      return user;
    })
    .catch((error) => {
      console.log(error);
      let username = googleUser.email;
      let password = 'fakepasswordbutnotreallysinceitisapasswordbutitwillbelongsonoonewillbreakintoit';
      return this.create({
        username: username,
        password: password,
        email: googleUser.email,
      });
    } );
};

userSchema.statics.authenticate = function(userObj) {
  return this.findOne({username: userObj.username})
    .then(user => user && user.passwordCheck(userObj.password))
    .catch(err => { throw err; });
};

userSchema.statics.authorize = function(token) {
  let user = jwt.verify(token, process.env.APP_SECRET || 'change');
  return this.findOne({_id: user.id})
    .then(user => {
      return user; 
    })
    .catch(err => { throw err; } );
};

userSchema.methods.passwordCheck = function (password) {
  return bcrypt.compare(password, this.password)
    .then(response => {
      return response ? this : null;
    });
};

userSchema.methods.generateToken = function() {
  return jwt.sign({id:this._id}, process.env.APP_SECRET || 'change');
};

export default mongoose.model('User', userSchema);