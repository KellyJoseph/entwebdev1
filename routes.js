'use strict';

const fs = require('fs');
const cloudinary = require('cloudinary');
const cloudinaryConfig = {
  "cloud_name": "dxdletsbp",
  "api_key": "241446678877343",
  "api_secret": "gRJjP5T0VUFNHRS-h7eJcPkptbY"
};
cloudinary.config(cloudinaryConfig);

const Accounts = require('./app/controllers/accounts');
const Locations = require('./app/controllers/locations');
const Photos = require('./app/controllers/photos');
const Admin = require('./app/controllers/admin');
const handleFileUpload = file => {
  return new Promise((resolve, reject) => {
    const filename = file.hapi.filename
    const data = file._data

    fs.writeFile('./upload/' + filename, data, err => {
      if (err) {
        reject(err)
      }
      resolve({ message: 'Upload successfully!' })
    })
  })
};

module.exports = [
  { method: 'GET', path: '/', config: Accounts.index },
  { method: 'GET', path: '/signup', config: Accounts.showSignup },
  { method: 'GET', path: '/login', config: Accounts.showLogin },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/signup', config: Accounts.signup },
  { method: 'POST', path: '/login', config: Accounts.login },
  { method: 'GET', path: '/showusersettings', config: Accounts.showUserSettings },
  { method: 'POST', path: '/updateusersettings', config: Accounts.updateUserSettings },

  { method: 'GET', path: '/home', config: Locations.home },
  { method: 'GET', path: '/listlocations', config: Locations.listLocations },
  { method: 'POST', path: '/addlocation', config: Locations.addLocation },
  { method: 'GET', path: '/deletelocation/{id}', config: Locations.deleteLocation },
  { method: 'GET',  path: '/updatelocationform/{id}', config: Locations.updateLocationForm },
  { method: 'POST',  path: '/updatelocation/{id}', config: Locations.updateLocation },


  { method: 'GET', path: '/adminhome', config: Admin.adminHome },
  { method: 'GET', path: '/adminlistlocations', config: Admin.listLocations },
  { method: 'GET', path: '/deleteuser/{id}', config: Admin.deleteUser },

  { method: 'GET', path: '/displayphotos/{name}', config: Photos.displayPhotos },


  { method: 'POST', path: '/uploadphoto/{location}', config: Photos.uploadPhoto},
  { method: 'GET', path: '/deleteimage/{id}', config: Photos.deleteImage},
//this last one displays static files
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './public'
      }
    },
    options: { auth: false }
  }
];
