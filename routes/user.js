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
		

		loadUser = function(user){
			// Function to do remainder of work after db query is finished
			doOtherStuff = function(theUser){
				var isSelf = (user.Username.toLowerCase() == req.session.username);
				console.log('theuser: '+JSON.stringify(theUser));
				console.log('user: '+JSON.stringify(user));

				res.render("user.jade", { title: 'User Profile', variable:{user: theUser, isSelf: isSelf, loadingUser: user} });
			};
			db.getUserByUsername(req.session.username, doOtherStuff);
		}
	

		db.getUserByUsername(req.params.user, function(theUser) {
			if(theUser != undefined)
				loadUser(theUser);
			else
				sendErrorPage('Error: 120', res);
	  	});
	} else{
		console.log('Something went wrong with loading user profile');
		sendErrorPage('Error: 121', res)
	}	
};

exports.editProfile = function(req, res){
	var isLoggedIn = (req.session.username != undefined);
	if(isLoggedIn){
		
		loadUser = function(){
			// Function to do remainder of work after db query is finished
			doOtherStuff = function(theUser){
				res.render("editProfile.jade", { title: 'Edit Profile', variable:{user: theUser} });
			};
			db.getUserByUsername(req.session.username, doOtherStuff);
		}
		loadUser();
	} else{
		console.log('Something went wrong with loading edit user profile');
		sendErrorPage('Error: 121', res)
	}	
};

exports.uploadPP = function(req, res){
	var isLoggedIn = (req.session.username != undefined);
	if(isLoggedIn){
		
		loadUser = function(){
			// Function to do remainder of work after db query is finished
			doOtherStuff = function(theUser){
				res.render("uploadPP.jade", { title: 'Upload Profile Picture', variable:{user: theUser} });
			};
			db.getUserByUsername(req.session.username, doOtherStuff);
		}
		loadUser();
	} else{
		console.log('Something went wrong with loading uplaod profile picture');
		sendErrorPage('Error: 121', res)
	}	
};

// A page which displays the users
exports.users = function(req, res){
	if(req.session.username != undefined){
		var start = 0;
		if(req.params.num != undefined)
			var start = req.params.num;
		var limit = 50;
		// Function to do remainder of work after db query is finished
		doOtherStuff = function(users, user, start){
				res.render("users.jade", { title: 'Users', variable:{users: users, user: user, start: start} });
		};
		
		// Gets the categories from the database
		db.getUsers(start, limit, 'UserID', function(users) {
			db.getUserByUsername(req.session.username, function(user){
				doOtherStuff(users, user, start);
			});
	  	});
	} else{
		res.render("login.jade", {title: 'Please Login',  variable:{user: undefined}});
	}
};

function sendErrorPage(error, res){
		res.render("error.jade", {title: 'Error Page', error: error, variable:{user: undefined}});
}