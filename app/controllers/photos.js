'use strict';

const User = require('../models/user');
const Photo = require('../models/photo');
const Location = require('../models/location');
const cloudinary = require('cloudinary');
const util = require('util');
const fs = require('fs');
const ImageStore = require('../utils/image-store');
const writeFile = util.promisify(fs.writeFile);
/*const cloudinaryConfig = {
"cloud_name": "dxdletsbp",
"api_key": "241446678877343",
"api_secret": "gRJjP5T0VUFNHRS-h7eJcPkptbY"
};
cloudinary.config(cloudinaryConfig);
*/

const Photos = {

  displayPhotos: {
    handler: async function(request, h) {
      const location = request.params.name;
      console.log("now viewing photos for " + location);
      //let allImages = await Photo.find();
      let allImages = await Photo.find({ location: location});
      console.log(allImages);
      return h.view('displayphotos', {
        title: 'Cloudinary Gallery',
        cloudinary: this.cloudinaryCredentials,
        images: allImages,
        location: location
      });
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
        author: user._id
      });
      await newLocation.save();
      return h.redirect('/listlocations');
    }
  },

  //From the uploadphoto form, we get a payload with the file and the title. We write that file to a local folder
  //called public as temp.img. We then upload it to cloudinary. While uploading it to cloudinary we set the response as
  //the variable const result. We can grab the url from this upload from this. We then create a new photo object using
  //photo schema, and put the url and title
  //first create cloudinary image, then get the url snd public_id for that image and put it in a mongodb object

  uploadPhoto: {
      handler: async function(request, h) {
        const photo = request.payload.file;
        console.log(request.params.location);
        if (Object.keys(photo).length > 0) {
          await writeFile('./public/temp.img', photo);
          const result = await cloudinary.v2.uploader.upload('./public/temp.img', function(error, result) {console.log(result)});
          const newPhoto = new Photo({
            title: request.payload.title,
            url: result.url,
            public_id: result.public_id,
            location: request.params.location //whichever location is selected from the menu, that location is passed
            // to the displayphotos handler as a parameter. this is then extracted as request.paramas.location passed
            // to the displayphotos view among the view data, and once again passed as a parameter to this uploadPhoto
            // handler
          })
          await newPhoto.save();
          return h.redirect('/listlocations');
        }
        return h.redirect('/listlocations');
      }
    },
  //need to first delete cloudinary image, then the mongodb object that has the url to that cloudinary image
  deleteImage: {
    handler: async function(request, h) {
      const mongoid = request.params.id; //get the id for the mongodb object. T
      const photoToDelete = await Photo.findById(mongoid); //use that id to retrieve the mongodb document object
      const public_id = photoToDelete.public_id; //obtain the public_id for the cloudinary image in the photo object
      console.log(photoToDelete);
      await cloudinary.v2.uploader.destroy(public_id, {}, function(error, result) { // delete the image from cloudinary
        console.log(result)
      });
      const photo = await Photo.remove({_id: request.params.id}) //delete the object from mongodb
      return h.redirect('/listlocations');
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
        author: user._id
      });
      await newLocation.save();
      return h.redirect('/listlocations');
    }
  },

};
module.exports = Photos;
