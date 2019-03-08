# entwebdev1
A Hapi framework Node app using a Mongo DB. Make accounts, share locations, post photos, write descriptions
This is a simple web app that allows users to register an account, post a point of interest (Location). 
Users can then select that location, or any other Location that they or other users have posted, and view or
upload photos of that location. These locations can also be deleted. In it's current form, anyone can delete a location
however it would be quite easy to ensure that only the author who created that location can delete it, simply by adding
the user's id to the location and verifying if the user id matches the location id. 
Not much focus on the presentation or visual design was put into this assignment, most of the effort was put into the
management of the accounts, locations and images rather than the presentation, something that I would like to improve.
There is some error and exception handling, however it has not been implemented consistently for this assignment so it
may not be as robust as it should be.
There are models for User, Location and Photo, each with a MongoDB schema specifying what the objects for these should
be, what fields and data types are required, and assigning a Mongo generated id for each instance created from these schemas.
When an image is created, it is saved to a temporary folder, then uploaded from there to Cloudinary, and the url for that 
image returned. From within the same handler, a new Photo object is created from the Photo model/schema, and the previously
obtained Cloudinary url is set as a field in that object, and saved to MongoDB with and MongoDB generated ID number. These 
objects also have the loaction name passed from the view with the upload form, so that the photo location field can be matched
with the Location object, and the photos displayed match the selected Location.

