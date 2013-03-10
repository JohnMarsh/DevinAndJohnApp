database = require('../db')
// Gets the database object
var db = database.database();

exports.index = function(req, res){
	
	// Function to do remainder of work after db query is finished
<<<<<<< HEAD
	doOtherStuff = function(theContent, theUser){
			console.log('The userinfo is: ', theUser);
			res.render("index.jade", { title: 'Home', variable:{content: theContent, user: theUser} });
	};
	
	// Gets the categories from the database
	db.getContent(0, 100, 'Content.DateTime', function(theContent) {
		db.getUser(1, function(theUser) {
			doOtherStuff(theContent, theUser);
  		});
  	});
	
=======
	doOtherStuff = function(theUser){
			console.log('The userinfo is: ', theUser);
			res.render("index.jade", { title: 'Home', variable:{user: theUser} });
	};
	
	// Gets the current user from database
	db.getUser(1, function(theUser) {
		doOtherStuff(theUser);
  	});	
>>>>>>> d404f171194eb6dcedaa55e5324406989df6bb7f
};