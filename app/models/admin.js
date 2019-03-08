'use strict';

const Boom = require('boom');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const adminSchema = new Schema({
  //_id: new mongoose.Types.ObjectId(),
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  admin: true
});

adminSchema.statics.findByEmail = function(email) {
  return this.findOne({ email : email});
};


adminSchema.methods.comparePassword = function(candidatePassword) {
  const isMatch = this.password === candidatePassword;
  if (!isMatch) {
    throw new Boom('Password mismatch');
  }
  return this;
};

module.exports = Mongoose.model('Admin', adminSchema);
