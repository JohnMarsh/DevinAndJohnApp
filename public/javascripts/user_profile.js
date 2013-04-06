UserProfileFunctions = (function(){
	var currentUser;
	var isSelf;
	var user;
	var isStalking;
	//Private members
	doRest  = function(){
		createNewsFeed();
		createProfile();
	}

	createProfile = function(){
		displayTop();
		displayBasicInfo();
		displayUserImage();
		loadStalkers();
		loadStalkings();
	}

	displayTop = function(){
		if(!isSelf)
			$.post("/userIsStalkingUser", { user: currentUser.UserID })
			.done(function(data) {
				isStalking = data;
				displayStalkButton(data);
			});
		$('#UsernameTitle').append(currentUser.Username);
		if(isSelf)
			$('#TopOfUserProfile').append('<div class="editProfileButton"><a href="/editProfile">Edit Profile</div></a>');
	}

	displayStalkButton = function(isStalking){
		if(isStalking != undefined && isStalking === false){
			$('#StalkButton').append("<p class=\"StalkingText\">Stalk</p>");
		} else if(isStalking != undefined && isStalking === true){
			$('#StalkButton').append("<p>Unstalk</p>");
		}
		$('#StalkButton').show();
	}

	loadStalkers = function(){
		$.post("/getStalkersForUser", { userID: currentUser.UserID })
		.done(function(data) {
			if(data != undefined){
				displayStalks(data, 'Stalkers');
			} else{
				displayStalks(undefined);
			}
		});
	}

	loadStalkings = function(){
		$.post("/getStalkingsForUser", { userID: currentUser.UserID })
		.done(function(data) {
			if(data != undefined){
				displayStalks(data, 'Stalkings');
			} else{
				displayStalks(undefined);
			}
		});
	}

	displayUserImage = function(){
		if(currentUser != undefined){
			if(currentUser.FileName != undefined){
				$('#UserImageBox').append('<div class="UserImageBox"><img class="userImage" src="/public/images/user/'+currentUser.FileName+'" /></div>');
			} else{	
				appendDefaultUserImage();
			}
		} else{	
			appendDefaultUserImage();
		}
		if(isSelf)
			$('#UserImageBox').append('<p><a href="/uploadPP">Edit Profile Picture</a></p>');
	}

	appendDefaultUserImage = function(){
		$('#UserImageBox').append('<img class="userImage" src="/public/images/user/default.jpg" />');
	}

	displayBasicInfo = function(){
		if(currentUser != undefined){
			$('#UserInfoBox').append('<p><b>Name:</b> '+currentUser.FirstName+' '+currentUser.LastName+'</p>');
			$('#UserInfoBox').append('<p><b>Birthday:</b> '+getDateFromMysql(currentUser.Birthday)+'</p>');
			$('#UserInfoBox').append('<p><b>Location:</b> '+currentUser.City+', '+currentUser.Country+'</p>');
		}
	}

	// Displays stalkings and stalkers on the DOM
	displayStalks = function(stalkers, type){
		if(stalkers != undefined && type != undefined){
			$('#'+type+'Box').append('<h4>'+stalkers.length+'</h4>');
		} else{
			$('#StalkersBox').append('<h4>0</h4>');
			$('#StalkingsBox').append('<h4>0</h4>');
		}
	}

	// Displays stalkings and stalkers on the DOM
	displayStalksDetail = function(stalkers, type){
		if(stalkers != undefined && type != undefined){
			if(stalkers.length>0){
		    	for(var i = 0; i<stalkers.length; i++)
		    		$('#'+type+'Box').append('<strong><a href="/user/'+stalkers[i].Username+'">'+stalkers[i].Username+'</strong><br/>');
			} else {
				$('#'+type+'Box').append('<strong>This user has 0 '+type+'.</strong>');
			}
		} else{
			$('#StalkersBox').append('<strong>This user has no stalkers.</strong>');
			$('#StalkingsBox').append('<strong>This user is not stalking anyone.</strong>');
		}
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
			return(
				   vars.isSelf != undefined 
				&& vars.loadingUser !=undefined);
		return false;
	}

	contineLoadingEditProfile = function(){
		$("#firstName").val(user.FirstName);
		$("#lastName").val(user.LastName);
		$("#email").val(user.Email);
		$("#country").val(user.Country);
		$("#city").val(user.City);
		$("#birthday").val(dateToYMD(user.Birthday));
	}

	contineLoadingEditPP = function(){
		displayCurrentUserImage();
	}

	displayCurrentUserImage = function(){
		$('#box').empty();
		if(user.FileName != undefined){
			var width = user.Width;
			console.log('-'+JSON.stringify(user));
			if(width >100)
				width = 100;
			$('#box').append('<div class="UserImageBoxEdit"><img class="userImage" width="'+width+'" src="/public/images/user/'+user.FileName+'" /></div>');
		} else{	
			$('#box').append('<img width="100" class="userImage" src="/public/images/user/default.jpg" />');
		}
	}

//----------------------------------------------------------------------------//
// Handlers                                                                   //
//----------------------------------------------------------------------------//

	$(document).delegate("div[id^='UserImageBox']", "click", function() {
		if(currentUser != undefined){
			if(currentUser.FileName != undefined){
				$form = $('<img src="/public/images/user/'+currentUser.FileName+'" style="height:500px;width:auto;"/>');
			} else{	
				$form = $('<img src="/public/images/user/default.jpg" style="height:500px;width:auto;"/>');
			}
		} else{	
			$form = $('<img src="/public/images/user/default.jpg" style="height:500px;width:auto;"/>');
		}
		$form.bPopup({
            opacity: 0.6
        });     
	});

	$(document).delegate("div[id^='StalkButton']", "click", function() {
		updateUI = function(data){
			if(data != undefined && data != false){
				if(isStalking != undefined && isStalking != true){
					$("div#StalkButton").html("<p class=\"StalkingText\">Unstalk</p>");
					isStalking = true;
				} else{	
					$("div#StalkButton").html("<p class=\"StalkingText\">Stalk</p>");
					isStalking = false;
				} 
			} else{
				$("div#StalkButton").html("<p class=\"StalkingText\">Error</p>");
			}
		}
		if(isStalking != undefined && isStalking != true){
			$.post("/stalkUser", { user: currentUser.UserID })
			.done(function(data) {
				updateUI(data);
			});
		} else{
			$.post("/unstalkUser", { user: currentUser.UserID })
			.done(function(data) {
				updateUI(data);
			});
		}  
	});

	//Check if input is okay and if so send entered data to server
	$(document).delegate("button[id^='saveButton']", "click", function() {
		if(!errorCheckEditProfileForm()){
			var obj = {
				FirstName: $("#firstName").val(),
				LastName: $("#lastName").val(),
				Email: $("#email").val(),
				Country: $("#country").val(),
				City: $("#city").val(),
				Birthday: $("#birthday").val()
			}
			$.post("/saveProfileInfo", { info: obj })
			.done(function(data) {
				if(data)
					alert("Your info has been saved.");
				else
					alert("There was an error saving your info.")
			});
		}
	});

	//Sends a delete post request for the current image
	$(document).delegate("button[id^='deleteButton']", "click", function() {
		$.post("/deleteUserImage", { user: user })
		.done(function(data) {
			if(data)
				$('#box').fadeOut(1000, function(){
					user.FileName = undefined;
					displayCurrentUserImage();
					$('#box').fadeIn(1000, function(){
					});
				});
			else
				alert("There was an error saving your info.")
		});
	});

	//Sends a upload post to the server
	$(document).delegate("button[id^='uploadButton']", "click", function() {

		var imgVal = $('#imageFile').val(); 
        if(imgVal=='') 
        { 
            alert("empty input file"); 
        	return false; 
        } 
        var pieces = imgVal.split(/[\\]+/);
		var name = pieces[pieces.length-1];
        console.log('--'+name);
		$.post("/uploadUserImage", { path: imgVal, name:name })
		.done(function(data) {
			if(data)
				$('#UserImageBox').fadeOut(1000, function(){
					displayCurrentUserImage();
					$('#UserImageBox').fadeIn(1000, function(){
					});
				});
			else
				alert("There was an error saving your info.")
		});
	});

	

//----------------------------------------------------------------------------//
// Utilities                                                                  //
//----------------------------------------------------------------------------//

	// Performs error checking for the entire form
	function errorCheckEditProfileForm(){
		var errorString ="";
		var isError = false;
		var obj = {
			FirstName: $("#firstName").val(),
			LastName: $("#lastName").val(),
			Email: $("#email").val(),
			Country: $("#country").val(),
			City: $("#city").val(),
			Birthday: $("#birthday").val()
		}

		if(!ErrorChecking.isOkName(obj.FirstName)){
			isError = true;
			errorString = errorString+"The first name you entered in not valid\n";
		}
		if(!ErrorChecking.isOkName(obj.LastName)){
			isError = true;
			errorString = errorString+"The last name you entered in not valid\n";
		}
		if(!ErrorChecking.isOkEmail(obj.Email)){
			isError = true;
			errorString = errorString+"The email you entered in not valid\n";
		}
		if(!ErrorChecking.isOkCountry(obj.City)){
			isError = true;
			errorString = errorString+"The city you entered in not valid\n";
		}
		if(!ErrorChecking.isOkCountry(obj.Country)){
			isError = true;
			errorString = errorString+"The country you entered in not valid\n";
		}
		if(!ErrorChecking.isOkDate(obj.Birthday)){
			isError = true;
			errorString = errorString+"The birthday you entered in not valid\n";
		}
		if(isError)
			alert(errorString);
		return isError;
	}

	function getDateFromMysql(stringDate){
		var monthNames = [ "January", "February", "March", "April", "May", "June",
    					   "July", "August", "September", "October", "November", "December" ];
		var d = new Date(stringDate);
		var month = d.getMonth();
		var year = d.getFullYear();
		var day = d.getDate()+1;
		var dString =  monthNames[month] + ' ' + day + ' ' +  year;
		return dString;
	}

	function dateToYMD(stringDate){
		var d = new Date(stringDate);
		var month = d.getMonth()+1;
		var year = d.getFullYear();
		var day = d.getDate();
		var dString =  year+'-'+month+'-'+day;
		return dString;
	}

//----------------------------------------------------------------------------//
// Global members                                                             //
//----------------------------------------------------------------------------//	
return{
		loadInUser: function (variables){
			if(checkCorrectVariables(variables)){
				currentUser = variables.loadingUser;
				user = variables.user;
				isSelf = variables.isSelf;
				doRest();
				return;
			}

			handleError();
		},

		loadEditProfile: function (variables){
			if(variables.user != undefined){
				user = variables.user;
				contineLoadingEditProfile();
				return;
			}

			handleError();
		},

		loadEditPP: function (variables){
			if(variables.user != undefined){
				user = variables.user;
				contineLoadingEditPP();
				return;
			}

			handleError();
		}
	}
})();