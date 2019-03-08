'use strict';

const User = require('../models/user');
const Location = require('../models/location');
const Joi = require('joi');

// handlers are request - response functions (request is request object and h is response object)
// request object contains data about the request
const Locations = {
  home: {
    handler: function(request, h) {
      return h.view('home', { title: 'Post a Location' });
    }
  },
  adminhome: {
    handler: function(request, h) {
      return h.view('adminhome', { title: 'Post a Location' });
    }
  },
  listLocations: {
    handler: async function(request, h) {
      const locations = await Location.find().populate('author');
      return h.view('listlocations', {
        title: 'Locations to Date',
        locations: locations
      });
    }
  },

  addLocation: {
    handler: async function(request, h) {
      const id = request.auth.credentials.id; //comes from session cookie. Where is the id created? Can't see it im
      const user = await User.findById(id); //... account signup or the User model? How can it be used to find a user?
      const data = request.payload;
      const newLocation = new Location({
        name: data.name,
        description: data.description,
        author: user._id,
        region: data.region,
        latitude: data.latitude,
        longitude: data.longitude
      });
      await newLocation.save();
      return h.redirect('/listlocations');
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

  updateLocationForm: {
    handler: async function(request, h) {
      const id = request.params.id;
      const location = await Location.findById(id);
      return h.view('updatelocation', {
        title: 'Locations to Date',
        location: location,
        id: id
      });
    }
  },
  updateLocation: {
    handler: async function(request, h) {
      const id = request.params.id;
      const locationToEdit = await Location.findById(id);
      //const formData = request.payload;
      //locationToEdit.name = request.payload.name;
      locationToEdit.description = request.payload.description;
      //locationToEdit.latitude = request.payload.latitude;
      //locationToEdit.longitude = request.payload.longitude;
      locationToEdit.save();
      return h.redirect('/listlocations');
    }
  }
}

module.exports = Locations;
