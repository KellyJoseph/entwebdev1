'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;


const photoSchema = new Schema({
  title: String,
  url: String,
  public_id: String,
  location: String,
  uploader: {
    type: Schema.Types.ObjectId,  //this is a mongodb method, always schema.types.objectid
    ref: 'User' //retrieves an object from mongo, in this case a user object. User is a name we give to the sch
  } // that this object is an instance of. schema is basically like a class. We can call it anything, but User makes sense
});

photoSchema.statics.findById = function(id) {
  return this.findOne({ _id : id});
};

module.exports = Mongoose.model('Photo', photoSchema);