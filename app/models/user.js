'use strict';

const Boom = require('boom');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  //_id: new mongoose.Types.ObjectId(),
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  admin: false
});

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email : email});
};


userSchema.methods.comparePassword = function(candidatePassword) {
  const isMatch = this.password === candidatePassword;
  if (!isMatch) {
    throw new Boom('Password mismatch');
  }
  return this;
};

module.exports = Mongoose.model('User', userSchema);
