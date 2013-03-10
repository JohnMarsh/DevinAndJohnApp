database = require('../db')
var db = database.database();


// A page for uploading new content
exports.uploadContent = function(req, res){	
	// Function to do remainder of work after db query is finished
	doOtherStuff = function(theCategories){
			res.render("upload.jade", { title: 'Upload Content', variable:{categories: theCategories} });
	};
	
	// Gets the categories from the database
	db.getCategories(function(theContent) {
		doOtherStuff(theContent);
  	});
};

// A page which displays the categories
exports.categories = function(req, res){
	
	// Function to do remainder of work after db query is finished
	doOtherStuff = function(theCategories){
			res.render("categories.jade", { title: 'Categories', variable:{categories: theCategories} });
	};
	
	// Gets the categories from the database
	db.getCategories(function(categories) {
		doOtherStuff(categories);
  	});
};


// A page which displays content of a category
exports.category = function(req, res){
	var category = req.params.category;
	var isOkQuery = db.errorCheck(category);
	
	if(isOkQuery && category != undefined){	
		// Function to do remainder of work after db query is finished
		doOtherStuff = function(theUser, theCategory){
				console.log('The userinfo is: ', theUser);
				res.render("category.jade", { title: theCategory.Name, variable:{user: theUser, category: theCategory} });
		};
		
		// Gets the current user from database
		db.getUser(1, function(theUser) {
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
};

// An error page
function sendErrorPage(error, res){
	res.render("error.jade", {title: 'Error Page', error: error});
}