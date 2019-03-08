'use strict';
//we need to import the dotenv file  because it has the path to our database.
require('dotenv').config();
const Hapi = require('hapi');

//init server and create a connection on localhost port 3000
const server = Hapi.server({
  port: process.env.PORT || 3000,
});

server.bind({
  cloudinaryCredentials: {}
});

// this import triggers a connection to mongoose, makes a mongoose object, connects to the db described in .env
require('./app/models/db');


//here we wrap a bunch of functions in an async function called init
// extensive use of await within here
async function init() {

  await server.register(require('inert'));

  await server.register(require('vision'));

  await server.register(require('hapi-auth-cookie'));

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layouts',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false
  });



  server.auth.strategy('standard', 'cookie', {
    password: process.env.cookie_password, //secures the cookie
    cookie: process.env.cookie_name,
    isSecure: false, //secure TLS connection requirement se to false
    ttl: 24 * 60 * 60 * 1000,
    redirectTo: '/'
  });

  server.auth.default({
    mode: 'required',
    strategy: 'standard' //all routes are guarded as standard, need valid cookie to use that route
    //the / route and signup route should NOT require a cookie for obvious reasons! Set auth to false for these
    //see accounts controller handlers, all set to false for this reason
  });

  // routes just tells the hapi.server what requests it will respond to.  Each request must have a handler
  // when http requests arrive at the server, hapi checks them against these routes and looks for a match
  // if a match is found, the associated handler will display a view with some data
  server.route(require('./routes'));

  //server starts listening from here on port 3000. We've imported routes above to deal with incoming requests
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

//  if init() fails, we arrive here
process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
