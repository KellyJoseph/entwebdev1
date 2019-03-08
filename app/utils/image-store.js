'use strict';

const cloudinary = require('cloudinary');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
//const photo = require('models/photo');

//https://cloudinary.com/documentation/admin_api Cloudinary API and functions

const ImageStore = {

  configure: function(cloudinaryConfig) {
    const credentials = {
      "cloud_name": "dxdletsbp",
      "api_key": "241446678877343",
      "api_secret": "gRJjP5T0VUFNHRS-h7eJcPkptbY"
    };
    cloudinary.config(credentials);
  },

  getAllImages: async function() {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },


  deleteImage: async function(id) {
    await cloudinary.v2.uploader.destroy(id, {});
  },

  uploadImage: async function(imagefile) {
    await writeFile('./public/temp.img', imagefile);
    await cloudinary.v2.uploader.upload('./public/temp.img', function(error, result) {console.log(result)});
  }
};

module.exports = ImageStore;