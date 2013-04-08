/public/javascripts/load_content.js
--------------
This client side file provides the core of the functionality for the application.  This file contains functions for handling the loading of content into a formatted container using jQuery Masonry.  It makes a request to the server for current content, and then appends it to the container of content.  Each content item in the container has like and dislikes buttons which have delegates inside of this file.  These delegates send either like or dislike requests to the server, and then append the current ratio of likes to dislikes.  This files also provided functionality for a single content page in which it generates a bar plot for showing the ratio of likes to dislikes.  This file also has functions for things such as: loading in newly uploaded content without refreshing the page, endless scroll which automatically appends new items and the ability to revote on items.

/public/javascripts/newsfeed.js
--------------
This file provides client side functions which work together to generate a newsfeed for a logged in user.  Through calling the loadNewsFeed(user) function, a request to the server for news feed items is made, and on return, these items are populated to the DOM.  These news feed items are activity from users which the logged in user is currently stalking.  Some features that this file provides are: incrementally requesting new items from the server and updating the times of news feed items on the DOM. 

/public/javascripts/registerJQ.js
--------------
This client side file is used for populating the autofill countries box on the registration page and also calls error checking functions on the input provided in the registration page. 

 /public/javascripts/search.js
--------------
This client side file provides functionality for the search page.  Through it’s functions, it detects when input is appended to the search box.  As soon as input is typed, and as input is typed, it makes requests to the server for finding content and users similar to what is currently in the text box.  The results given back by the server are then automatically placed onto the page below the search box, without ever having to press a button or the enter key.

/public/javascripts/topBar.js
--------------
This client side file is included by every jade template and is used for displaying the menu bar for either a logged in user or a guest.  

/public/javascripts/user_profile.js
--------------
This client side file contains many functions for displaying and altering a user profile.  One of it’s key abilities is that it appends items to the DOM to create the layout for a user profile page, including things such as their profile picture, basic info, and activity.  Using jQuery Masonry, it loads content items which users have voted on into a scattered view.  It also provided functionality for editing a user profile (e.g updating information and uploading/deleting their profile picture).  It also handles the client side work of stalking (in other words subscribing) to a users profile.  

/public/stylesheets/stylesheet.css
--------------
This is the main style sheet for the entire site and contains numerous formatting specifications for different items.

/views
--------------
categories.jade:  A page which displays the current categories of content, and allows you to click on one to browse

category.jade:  A page for a single category which displays all of its content inside a formatted container

content.jade:  A page for a single content item which displays the content title, image, ability to vote and a bar graph representing the like ratio

editProfile.jade:  A page for logged in users to edit their profile

error.jade:	 A page which displays that an error has occurred.  Certain errors detected from the server are redirected to this page.

index.jade: 	The main page which displays current trending content

layout.jade: 	The main jade file which all other jade files extend from.  It provides the header for each page

login.jade:  A login prompt which allows guest users to log in

newsfeed.jade: 	Displays the news feed containing activity from users you are currently stalking

pleaselogin.jade: 	A prompt alerting a user to login 

register.jade: 	The registration page which allows new users to sign up

search.jade: 	A search page which allows you to search content and users from the database

upload.jade: 	A upload page which allows a logged in user to upload new content

uploadPP.jade: 	A upload page which allows logged in users to upload or delete their user profile picture

user.jade: 	A user profile page for a user which displays their info, image and activity


