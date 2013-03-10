database = require('../db')
db = database.database();


exports.uploadContent = function(req, res){
	// Performs a query for getting the categories
	
	// Function to do remainder of work after db query is finished
	doOtherStuff = function(theCategories){
			res.render("upload.jade", { title: 'Upload Content', variable:{categories: theCategories} });
	};
	
	// Gets the categories from the database
	db.getCategories(function(theContent) {
		for(var i = 0; i<theContent.length; i++){
			console.log('The category info is: ', theContent[i].CategoryID);
		}
		doOtherStuff(theContent);
  	});
	
	
};