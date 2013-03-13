UserProfileFunctions = (function(){
	var currentUser;
	//Private members
	doRest  = function(){
		createNewsFeed();
	}

	createNewsFeed = function(){
		console.log(currentUser);
		LoadContentFunctions.initializeContentForUser(currentUser);
	}

	// Global members
	return{
		loadInUser: function (user){
			currentUser = user;
			doRest();
		}
	}
})();