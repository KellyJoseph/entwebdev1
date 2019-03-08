'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// Models are defined through the Mongoose.Schema interface. Has built in set and get methods, also has the pseudo join
// method poppulate(). ref model tells Mongo which model to use during population


const locationSchema = new Schema({
  name: String,
  description: String,
  region: String,
  latitude: String,
  longitude: String,
  author: {
    type: Schema.Types.ObjectId,  //this is a mongodb method, always schema.types.objectid
    ref: 'User' //retrieves an object from mongo, in this case a user object. User is a name we give to the sch
  } // that this object is an instance of. schema is basically like a class. We can call it anything, but User makes sense
});

module.exports = Mongoose.model('Location', locationSchema);

