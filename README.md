# entwebdev1
You can visit this app on Heroku at https://aqueous-falls-66270.herokuapp.com/

<h2>About this web app </h2>
An MVC Hapi framework Node.js web app using a Mongo DB. Make accounts, share locations, post photos, write descriptions
This is a simple web app that allows users to register an account, post a point of interest (Location). 
Users can then select that location, or any other Location that they or other users have posted, and view or
upload photos of that location. These locations can also be deleted. In it's current form, anyone can delete a location
however it would be quite easy to ensure that only the author who created that location can delete it, simply by adding
the user's id to the location and verifying if the user id matches the location id. 

<h2>How this app works</h2>
There are models specifying for object(document) schema for User, Location and Photo and what fields and data types are required when saving to MongoDB. Mongo creates and assigns a unique id for each instance created from these schemas.
When an image is created, it is saved to a temporary folder, then uploaded from there to Cloudinary, and the url for that 
image is returned. From within the same handler that uploads the photo to Cloudinay, a new Photo object is created from the Photo model/schema using the form data payload and the previously obtained Cloudinary url is set as a field in that object (document), and saved to MongoDB with and MongoDB generated ID number. These Photo objects also have the loaction name passed from the view with the upload form (request.params.id). This field is useful when obtaining the relevant photos to display when selecting a location to display. The find photos handler only finds the photos that have the same id as the location being displayed.

<h2>Room for improvement</h2>
Not much focus on the presentation or visual design was put into this assignment, most of the effort was put into the
management of the accounts, locations and images rather than the presentation, something that I would like to improve.
There is some error and exception handling, however it has not been implemented consistently for this assignment so it
may not be as robust as it should be. These would be the main areas for improvement. It would also be good to introduce a map widget that displays the coordinates that teh user enters along with the location.
