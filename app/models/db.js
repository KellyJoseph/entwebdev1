'use strict';

require('dotenv').config();
const Mongoose = require('mongoose');

async function seed() {
  var seeder = require('mais-mongoose-seeder')(Mongoose);
  const data = require('./initdata.json');
  const Location = require('./location');
  const User = require('./user');
  const dbData = await seeder.seed(data, { dropDatabase: false, dropCollections: true });
  console.log(dbData);
}


Mongoose.connect(process.env.db);
//^^ here we create a connection to the mongodb. We feed it variables for mongodb:// URI, or the parameters host,
//^^ database, port, options. In this case we have a URI in the .env file i.e. (db=mongodb://localhost/donation)

const db = Mongoose.connection;
// ^^ once connected, the open event is fired on this connection instance. This connection is invoked as
// mongoose.connection. Here we assign that database connection instance connection to the variable db


db.on('error', function(err) {
  console.log(`database connection error: ${err}`);
});

db.on('disconnected', function() {
  console.log('database disconnected');
});

db.once('open', function() {
  console.log(`database connected to ${this.name} on ${this.host}`);
  seed();
})