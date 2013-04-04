database = require('../db')
var db = database.database();


// A page for uploading new content
exports.uploadContent = function(req, res){	
	if(req.session.username != undefined){
		// Function to do remainder of work after db query is finished
		doOtherStuff = function(theUser, theCategories){
				res.render("upload.jade", { title: 'Upload Content', variable:{categories: theCategories, user: theUser} });
		};
		// Gets the current user from database
		db.getUserByUsername(req.session.username, function(theUser) {
			db.getCategories(function(cat) {
				if(cat != undefined && theUser != undefined)
					doOtherStuff(theUser, cat);
				else
					sendErrorPage('Error: 322', res);
			});
	  	});	
	} else{
		res.render("login.jade", {title: 'Please Login',  variable:{user: undefined}});
	}
};

// A page which displays a news feed for a user
exports.newsfeed = function(req, res){	
	if(req.session.username != undefined){
		// Function to do remainder of work after db query is finished
		doOtherStuff = function(theUser, theCategories){
			res.render("newsfeed.jade", { title: 'Upload Content', variable:{user: theUser} });
		};
		// Gets the current user from database
		db.getUserByUsername(req.session.username, function(theUser) {
			if(theUser != undefined)
				doOtherStuff(theUser);
			else
				sendErrorPage('Error: 322', res);
	  	});	
	} else{
		res.render("login.jade", {title: 'Please Login',  variable:{user: undefined}});
	}
};

// A page which displays the categories
exports.categories = function(req, res){
	if(req.session.username != undefined){
		// Function to do remainder of work after db query is finished
		doOtherStuff = function(theCategories, theUser){
				res.render("categories.jade", { title: 'Categories', variable:{categories: theCategories, user:theUser} });
		};
		
		// Gets the categories from the database
		db.getCategories(function(categories) {
			db.getUserByUsername(req.session.username, function(theUser) {
				doOtherStuff(categories, theUser);
			});
	  	});
	} else{
		res.render("login.jade", {title: 'Please Login',  variable:{user: undefined}});
	}
};


// A page which displays content of a category
exports.category = function(req, res){
	var category = req.params.category;
	var isOkQuery = db.errorCheck(category);
	if(req.session.username != undefined){
		if(isOkQuery && category != undefined){	
			// Function to do remainder of work after db query is finished
			doOtherStuff = function(theUser, theCategory){
					console.log('The userinfo is: ', theUser);
					res.render("category.jade", { title: theCategory.Name, variable:{user: theUser, category: theCategory} });
			};
			
			// Gets the current user from database
			db.getUserByUsername(req.session.username, function(theUser) {
				db.getCategory(category, function(cat) {
					if(cat != undefined)
						doOtherStuff(theUser, cat);
					else
						sendErrorPage('Error: 322', res);
				});
		  	});	
		} else{
			console.log('Something went wrong with loading category');
			sendErrorPage('Error: 321', res);
		}
	} else{
		res.render("login.jade", {title: 'Please Login',  variable:{user: undefined}});
	}
};

// A page which displays a single content
exports.contentPage = function(req, res){
	var content = req.params.content;
	var isOkQuery = db.errorCheck(content);
	if(req.session.username != undefined){
		if(isOkQuery && content != undefined){	
			// Function to do remainder of work after db query is finished
			doOtherStuff = function(theUser, theContent){
					res.render("content.jade", { title: content.Title, variable:{user: theUser, theContent: theContent }});
			};
		
			// Gets the current user from database
			db.getUserByUsername(req.session.username, function(theUser) {
				db.getSingleContentFromLoggedInUser(content, req.session.userid,  function(cat) {
					if(cat != undefined)
						doOtherStuff(theUser, cat);
					else
						sendErrorPage('Error: 322', res);
				});
		  	});	
		} else{
			console.log('Something went wrong with loading content');
			sendErrorPage('Error: 324', res);
		}
	} else{
		res.render("login.jade", {title: 'Please Login',  variable:{user: undefined}});
	}
};

// A page which displays search functionality
exports.search = function(req, res){
	if(req.session.username != undefined){
		// Function to do remainder of work after db query is finished
		doOtherStuff = function(theUser){
			res.render("search.jade", { title: "Search", variable:{user: theUser}});
		};
	
		// Gets the current user from database
		db.getUserByUsername(req.session.username, function(theUser) {
			doOtherStuff(theUser);
	  	});	
	} else{
		res.render("login.jade", {title: 'Please Login',  variable:{user: undefined}});
	}
};

// An error page
function sendErrorPage(error, res){
	res.render("error.jade", {title: 'Error Page', error: error,  variable:{user: undefined}});
}