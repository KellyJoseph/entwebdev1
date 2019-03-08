'use strict';

const User = require('../models/user');
const Location = require('../models/location');


// handlers are request - response functions (request is request object and h is response object)
// request object contains data about the request
const Admin = {

  adminHome: {
    handler: async function(request, h) {
      const users = await User.find();
      return h.view('adminhome', {
        title: 'List of Users',
        users: users
      });
    }
  },
  listLocations: {
    handler: async function(request, h) {
      const locations = await Location.find().populate('author');
      return h.view('adminlistlocations', {
        title: 'Locations to Date',
        locations: locations
      });
    }
  },

  deleteLocation: {
    handler: async function(request, h) {
      const locationId = request.params.id;
      console.log(locationId);
      const location = await Location.remove({ _id: request.params.id })
      return h.redirect('/listlocations');
    }
  },

  deleteUser: {
    handler: async function(request, h) {
      try {
        const userId = request.params.id;
        console.log(userId);
        await User.remove({ _id: request.params.id })
        const users = await User.find();
        return h.view('adminhome', {
          title: 'List of Users',
          users: users
        });
      } catch(err) {
        return h.view('adminhome', { errors: [{ message: err.message }] });
      }
    }
  }


/*
  deleteUser: {
    handler: async function(request, h) {
      try {
        const userId = request.params.id;
        console.log(userId);
        const user = await Location.remove({ _id: request.params.id });
        return h.view('adminhome', {
          title: 'List of Users',
          users: users
        });
      } catch (err) {
        return h.view('adminhome', { errors: [{ message: err.message }] });
      }
    }
  }
//request.params.id;
*/
};

module.exports = Admin;
