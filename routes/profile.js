exports.profile = function(req, res){
	if(req.session.username != undefined){
		// Function to do remainder of work after db query is finished
		doOtherStuff = function(theUser){
				res.render("profile.jade", { user: theUser });
		};
		// Gets the current user from database
		db.getUserByUsername(req.session.username, function(theUser) {
			doOtherStuff(theUser);
	  	});	
	} else{
		res.render("login.jade", {title: 'Please Login',  variable:{user: undefined}});
	}	
}
