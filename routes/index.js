database = require('../db')
// Gets the database object
var db = database.database();

exports.index = function(req, res){
	
	// Function to do remainder of work after db query is finished
	doOtherStuff = function(theUser){
			res.render("index.jade", { title: 'Home', variable:{user: theUser} });
	};
	// Gets the current user from database
	db.getUser(1, function(theUser) {
		doOtherStuff(theUser);
  	});	
};