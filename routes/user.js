database = require('../db')
// Gets the database object
var db = database.database();

exports.userProfile = function(req, res){
	
	// Function to do remainder of work after db query is finished
	doOtherStuff = function(theUser){
		console.log('The userinfo is: ', theUser);
		res.render("user.jade", { title: 'User Profile', variable:{user: theUser} });
	};
	

	db.getUserByUsername(req.params.user, function(theUser) {
		doOtherStuff(theUser);
  	});	
};