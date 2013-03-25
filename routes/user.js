database = require('../db')
// Gets the database object
var db = database.database();

exports.userProfile = function(req, res){
	var userName = req.params.user;
	var isOkQuery = db.errorCheck(userName);
	var isLoggedIn = false;
	if(req.session.username != undefined) isLoggedIn = true;
	console.log(JSON.stringify(req.session));
	
	if(isOkQuery && userName != undefined){
		// Function to do remainder of work after db query is finished
		doOtherStuff = function(theUser){
			var isSelf = (theUser.Username == req.session.username);
			res.render("user.jade", { title: 'User Profile', variable:{user: theUser, isSelf: isSelf} });
		};
		

		db.getUserByUsername(req.params.user, function(theUser) {
			if(theUser != undefined)
				doOtherStuff(theUser);
			else
				sendErrorPage('Error: 120', res);
	  	});
	} else{
		console.log('Something went wrong with loading user profile');
		sendErrorPage('Error: 121', res)
	}	
};

// A page which displays the users
exports.users = function(req, res){
	
	// Function to do remainder of work after db query is finished
	doOtherStuff = function(users){
			res.render("users.jade", { title: 'Users', variable:{users: users} });
	};
	
	// Gets the categories from the database
	db.getUsers(0, 100, 'UserID', function(users) {
		doOtherStuff(users);
  	});
};

function sendErrorPage(error, res){
		res.render("error.jade", {title: 'Error Page', error: error});
}