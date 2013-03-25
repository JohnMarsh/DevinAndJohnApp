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
		res.render("login.jade", {title: 'Please Login'});
	}
};

// A page which displays the categories
exports.categories = function(req, res){
	if(req.session.username != undefined){
		// Function to do remainder of work after db query is finished
		doOtherStuff = function(theCategories){
				res.render("categories.jade", { title: 'Categories', variable:{categories: theCategories} });
		};
		
		// Gets the categories from the database
		db.getCategories(function(categories) {
			doOtherStuff(categories);
	  	});
	} else{
		res.render("login.jade", {title: 'Please Login'});
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
		res.render("login.jade", {title: 'Please Login'});
	}
};

// An error page
function sendErrorPage(error, res){
	res.render("error.jade", {title: 'Error Page', error: error});
}