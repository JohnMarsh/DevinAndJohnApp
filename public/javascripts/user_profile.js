UserProfileFunctions = (function(){
	var currentUser;
	var isSelf;
	//Private members
	doRest  = function(){
		createNewsFeed();
		createProfile();
	}

	createProfile = function(){
		loadStalkers();
	}

	loadStalkers = function(){
		$.post("/getStalkersForUser", { userID: currentUser.UserID })
		.done(function(data) {
			if(data != undefined){
				displayStalkers(data);
			} else{
				displayStalkers(undefined);
			}
		});
	}

	displayStalkers = function(stalkers){
		console.log(JSON.stringify(stalkers));
		$OuterDiv = $('<div></div>')
    		.hide()
    		.append($('<p>'+ JSON.stringify(stalkers) +'</p>')
    	);
    	for(var i = 0; i<stalkers.length; i++)
    		$('#StalkersBox').append('<strong><a href="/user/'+stalkers[i].Username+'">'+stalkers[i].Username+'</strong>');
	}



	createNewsFeed = function(){
		LoadContentFunctions.initializeContentForUser(currentUser);
	}

	handleError = function(){
		$form = $('<div class="errorBox" style="height:100;width:300px;">'+
			'<p>Congratulations, you broke the site!<br/>Please reload the page.</p></div>');
		$form.bPopup({
			escClose: false,
			modalClose: false
	    }); 
	}

	// Returns true if given variables object is correct
	checkCorrectVariables = function(vars){
		if(vars != undefined)
			return(vars.user != undefined
				&& vars.isSelf != undefined);
		return false;
	}

	// Global members
	return{
		loadInUser: function (variables){
			if(checkCorrectVariables(variables)){
				currentUser = variables.user;
				isSelf = variables.isSelf;
				doRest();
				console.log(JSON.stringify(currentUser));
				return;
			}

			handleError();
		}
	}
})();