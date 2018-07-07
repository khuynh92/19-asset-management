[![Build Status](https://travis-ci.com/khuynh92/18-oauth.svg?branch=master)](https://travis-ci.com/khuynh92/18-oauth)

Travis: https://travis-ci.com/khuynh92/19-asset-management  
Heroku: https://khoa-19-asset-management.herokuapp.com  
PR: https://github.com/khuynh92/19-asset-management/pull/1  

## 19-asset-management

## testing routes

**note: most signin/signup GET/POST routes utilize cookies for authentication. A user must either provide a valid Bearer Token or Cookie to access Most APIs on this site** 

### OAuth Sign in/up
on the home page `https://khoa-19-asset-management.herokuapp.com` click on the anchor tag 'sign in with linkedIn' OR 'sign in with google' to test linkedIn OAuth. When signing in again, both Oauth links will resolve to the same user.

After a successful login/signup, the user will be redirected to their profile object, showing the images that they uploaded, userID, profile _id, name, and profilePic (based off of which OAuth account they signed up with)

### POST /signup
on the home page, use the form to create an account. The user will be redirected to their profile object, with the images they've uploaded, profile _id, userID, and name. *Note no profile picture will appear since the account was not created with OAuth*

### /signin
To test signin, Use the JWT that was given when signing up on the home page. Use that JWT as a bearer token in postman or httpie. The user will be redirected to their profile object.

#### get /profile & /profile/:id
when a user sends a get request to /profile, they will be redirected to their /profile/:id. If no profile/:id is found, a 404 NOT FOUND error will be returned.

### post /upload
To post a picture to s3 using /upload, use the form on the homepage. After a successful post with completed fields, a Image object will be returned giving the _id, title, and s3 URL.

### get /api/v1/images
api/v1/images shows all images that a user posted. The user can only see their image uploads, and no one elses.

### get /api/v1/images/:id
represents a single image that a user posted. If a user attempts to access a image/:id that they did not create, an Unauthorized Access Error will appear.

### delete /api/v1/image/:id
This will delete both the image in the database and the image in the aws s3 bucket. Upon success, a success message will appear: `<id> has successfully been deleted`. If a user attempts to delete a image they did not upload, an Unauthorized Access Error will appear. To check if the image has successfully been delete, go to /profile or /image/:id to see if the image still exists.


**This lab was built off of codefellows 19-asset-management demo code**