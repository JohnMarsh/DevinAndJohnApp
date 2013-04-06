LoadContentFunctions = (function(){

//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//

	var currentNumberOfContent = 0;				// Total # of contents displayed
	var maxNumberOfContent = 1000;				// Max number to load
	var currentTotalContent = 0;				// Total content loaded from server
	var isNoMoreData = false;					// True if no more data to load
	var content;								// Array of content
	var theUser;								// The user
	var mostRecentContent;						// The most recent content to be loaded
	var singleContent;							// For use of loading a single content

	//The type of load content happening
	//0 = Content for homepage, user signed in
	//1 = Content for user profile
	//2 = Single content page
	//Else = User not signed in
	var typeOfConnection;

//----------------------------------------------------------------------------//
// Load multiple content                                                      //
//----------------------------------------------------------------------------//

	// Does the initial post request for getting content and then calls a funciton
	// to constinue loading content
	function getContent(tempUser){
		currentNumberOfContent = 0;
		currentTotalContent = 0;
		isNoMoreData = false;
		$.post("/getContentFromUser", { startNum: 0, endNum: maxNumberOfContent, userID: tempUser.UserID })
		.done(function(data) {
			if(data!=undefined){
				currentTotalContent = data.length;
				content = data;
				theUser = tempUser;
				typeOfConnection = 0;
				mostRecentContent = content[0];
				handleLoadingContent();
				for(var i = 1; i< data.length; i++){
					var d1 = new Date(mostRecentContent.DateTime);
					var d2 = new Date(data[i].DateTime)
					if(d2>d1)
						mostRecentContent = data[i];
				}
			} else{
				handleError();
			}
		});
	}

	// Does the initial post request for getting content for a specific user and
	// then calls a funciton to constinue loading content
	function getContentForUser(tempUser){
		$.post("/getContentForUser", { startNum: 0, endNum: maxNumberOfContent, userID: tempUser.UserID })
		.done(function(data) {
			if(data != undefined){
				currentTotalContent = data.length;
				content = data;
				theUser = tempUser;
				typeOfConnection = 1;
				mostRecentContent = content[0];
				handleLoadingContent();
			} else{
				handleError();
			}
		});
	}

	// Does the initial post request for getting content for a specific category and
	// then calls a funciton to constinue loading content
	function getContentForCategory(category, tempUser){
		$.post("/getContentForCategoryFromUser", { startNum: 0, endNum: maxNumberOfContent, category: category.CategoryID,
		UserID: tempUser.UserID })
		.done(function(data) {
			if(data != undefined){
				currentTotalContent = data.length;
				content = data;
				theUser = tempUser;
				typeOfConnection = 0;
				mostRecentContent = content[0];
				handleLoadingContent();
			}else{
				handleError();
			}
		});
	}

	// Sets up massonry
	function handleLoadingContent(){
		//Loads masonry
		$( '#container' ).empty();
		$( '#container' ).masonry( { itemSelector: '.item', 
			isFitWidth: true,
			isAnimated: true

		});

		$(window).scroll(function() {
			if ($(window).scrollTop() >= $(document).height() - $(window).height()-100) {
				loadInContent($('#container'));
			}
		});
		
		//Loads in content received from server
		loadInContent($('#container'));
	}


	// Called to load data into the container
	function loadInContent(masonryContainer){
		if(content != undefined && currentNumberOfContent != currentTotalContent)
			continueLoading(masonryContainer);
		else{
			noMoreData(masonryContainer);
		}
	}

	// Does a loop for adding a specific amount of items to the container
	function continueLoading(masonryContainer){
		for(var i = currentNumberOfContent; i < currentNumberOfContent+14; i++) {
			var tempcontent = content[i];
			if(tempcontent == undefined) {
				currentNumberOfContent = i; 
				noMoreData(masonryContainer);
				break; 
			}
			appendContent(tempcontent, masonryContainer);
			
			if(tempcontent.IsLike != null && tempcontent.IsLike != undefined)
				displayHasLike(tempcontent.IsLike, tempcontent.ContentID, tempcontent.Ratio);
			masonryContainer.masonry('reload')
		}
		currentNumberOfContent = i;			
		masonryContainer.masonry('reload');
	}

	// Invoked appendNoMoreDataWarning if it has not been called yet
	function noMoreData(masonryContainer){
		if(!isNoMoreData){
			appendNoMoreDataWarning(masonryContainer);
			masonryContainer.masonry('reload')
		}
		isNoMoreData = true;
	}

	// Called to append a no more data object to the container
	function appendNoMoreDataWarning(masonryContainer){
		var theString = '<div class="item Wide centeredInDiv dislikeDiv" style="height:40px;'
		+ 'width: 100%; background-color: #903; vertical-align: middle;">'
		+'Sorry, no more data.</div>';
		var $boxes = $(theString);
		masonryContainer.append( $boxes ).masonry( 'appended', $boxes );
	}

	// Appends a single content to the container based on connection type
	function appendContent(content, masonryContainer, prepend){
		var el = document.createElement("option");
		var theTop = getTop(content);
		var theBottom = "";

		if(typeOfConnection == 0){
			theBottom = getBottomForConnectionType0(content);
		} else if (typeOfConnection == 1){
			theBottom = getBottomForConnectionType1(content);
		} else{
			theBottom = getBottomForConnectionNotLoggedIn(content);
		}

		var tempString = theTop + theBottom + '</div>'
		var $boxes = $(tempString);

		if(prepend != undefined){
			masonryContainer.prepend( $boxes ).masonry( 'appended', $boxes );
		} else{
			masonryContainer.append( $boxes ).masonry( 'appended', $boxes );
		}
	}

	// Gets the top of a content to be appended
	function getTop(content){
		var imageWidth;
		var imageHeight;
		imageWidth = 200;
		imageHeight = (200/content.Width) * content.Height;

		var bottomHeight = 80;
		var contentHeight = imageHeight + bottomHeight;
		var theString = '<div class="item Wide" style="height:' + contentHeight 
			+'px; width: +' + imageWidth + ';"><img class="contentImg" id="ContentImage_'+content.ContentID 
			+'" width="'+ imageWidth +'" src="' + getContentImageString(content) + '"/><br />' 
			+'<b><a href="/content/'+content.ContentID+'">'+ content.Title+'</a></b>';
		return theString;
	}

	// Gets the bottom of a content for connection type 0
	function getBottomForConnectionType0(content){
		if(content != undefined){

			// Gets the ratio of likes to dislikes
			var likesToDislikes = content.Ratio;			

			returnS = '<center> <div class="likeAndDislikeDiv" id="likeAndDislikeDiv_' + content.ContentID +'">'
	        +'<div class="centeredInDiv likeDiv" id="likeDiv_' + content.ContentID +'" name="' + content.ContentID +'">like</div>'
	        +'<div class="centeredInDiv spacerDiv" id="spacerDiv_' + content.ContentID +'" name="' + content.ContentID +'"></div>'
	        +'<div class="centeredInDiv dislikeDiv" id="dislikeDiv_' + content.ContentID +'" name="' + content.ContentID +'">dislike</div>'
	    	+'</div></center>'
	    	+'<div>'
			+'<div class="centeredInDiv haveLikedDiv" id="haveLikedDiv_' + content.ContentID +'" name="' + content.ContentID +'"></div>'
	    	+'<div class="centeredInDiv likesVsDislikesDiv" id="likesVsDislikesDiv_' + content.ContentID +'" name="' + content.ContentID +'">' 
	    	+'<p>' + likesToDislikes + '</p></div>'
	    	+'</div>';
			
			return returnS;	
		}
		return "";	
	}

	// Gets the bottom of a content for connection type 1
	function getBottomForConnectionType1(content){
		if(content != undefined){

			// Gets the ratio of likes to dislikes
			var userHasLikedString = "Error..."
			if(content.IsLike==0){
				userHasLikedString = "They dislike this.";
			} else if(content.IsLike==1){
				userHasLikedString = "They like this.";
			}	

			returnS = '<center> <div id="likeAndDislikeDivForUser_' + content.ContentID +'">'
			+'<div class="centeredInDiv userHaveLikedDiv" id="userHaveLikedDiv_' + content.ContentID +'" name="' + content.ContentID +'">'
			+userHasLikedString+'</div>'
	    	+'</div></center>';
			
			return returnS;	
		}
		return "";	
	}

	function loadMoreDataFromServer(){
		if(mostRecentContent != undefined){
			var d = getMySQLFormatDate(mostRecentContent.DateTime);
			$.post("/getMoreRecentContentFromUser", { mostRecentContent: d, userID: theUser.UserID })
			.done(function(data) {
				if(data!=''){
					mostRecentContent = data[0];
					handleLoadingNewContent(data, $('#container'));
				}
			});
		}
	}

	// Does a loop for adding a specific amount of items to the container
	function handleLoadingNewContent(data, masonryContainer){
		for(var i = 0; i < data.length; i++) {
			var d1 = new Date(mostRecentContent.DateTime);
			var d2 = new Date(data[i].DateTime)
			if(d2>d1)
				mostRecentContent = data[i];
			var tempcontent = data[i];
			if(tempcontent == undefined) {
				break; 
			}
			appendContent(tempcontent, masonryContainer, 1);
			
			if(tempcontent.IsLike != null && tempcontent.IsLike != undefined)
				displayHasLike(tempcontent.IsLike, tempcontent.ContentID, tempcontent.Ratio);
			masonryContainer.masonry('reload')
		}
		currentNumberOfContent = i;			
		masonryContainer.masonry('reload');
	}

	// Displays pop up asking the user to reload the page
	function handleError(){
		$form = $('<div class="errorBox" style="height:100;width:300px;">'+
			'<p>Congratulations, you broke the site!<br/>Please reload the page.</p></div>');
		$form.bPopup({
			escClose: false,
			modalClose: false
	    }); 
	}

//----------------------------------------------------------------------------//
// Load single content                                                        //
//----------------------------------------------------------------------------//
	function loadSingleContent(tempUser, content){
		if(content != undefined){
			if(content.ContentID != undefined){
				typeOfConnection = 2;
				theUser = tempUser;
				singleContent = content;
				loadSingleTitle();
				loadSingleImage();
				loadSingleBottom();
				loadSingleBar();
				return;
			}
		}
		handleError();
	}

	function loadSingleTitle(){
		$('#title').html('<h3>'+singleContent.Title+'</h3>');
	}

	function loadSingleImage(){
		var imageWidth = 200;
		var imageHeight = (200/singleContent.Width) * singleContent.Height;
		var imgString = '<img width="'+imageWidth+'" height="'+imageHeight+'" src="'+
						getContentImageString(singleContent)+'" />';
		$('#image').html(imgString);
	}

	function loadSingleBottom(){
		$('#rating').html('<div style="height:80px;">'+getBottomForConnectionType0(singleContent));
		if(singleContent.IsLike != null && singleContent.IsLike != undefined)
				displayHasLike(singleContent.IsLike, singleContent.ContentID, singleContent.Ratio);
	}

	function loadSingleBar(){
		$.post("/getLikesAndDislikes", { content: singleContent.ContentID })
		.done(function(data) {
			if(data!=undefined){
				displayLikesVSDislikesBar(data);
			} else{
				handleError();
			}
		});
	}

	function displayLikesVSDislikesBar(data){
		var total = data.Likes + data.Dislikes;
		if(total != 0){
			var likesRatio = Math.round(data.Likes/total*100);
			var dislikesRatio = Math.round(data.Dislikes/total*100);
			var likesPixels = Math.round(data.Likes/total*500);
			var dislikesPixels = Math.round(data.Dislikes/total*500);
			$('#barContainer').empty();
			$('#barContainer').append('<div class="likesBar" id="likesBar" style="width:'+0+'px"> '+likesRatio+'%</div>');
			setTimeout(loadLikesBar, 10)

			function loadLikesBar(){
				if($('#likesBar').width() < likesPixels){
					$('#likesBar').width($('#likesBar').width() + 2);
					setTimeout(loadLikesBar, 10)
				}
			}
			if(dislikesPixels>0){
				$('#barContainer').append('<div class="dislikesBar" id="dislikesBar" style="width:'+0+'px"> '+dislikesRatio+'%</div>');
				setTimeout(loadDislikesBar, 10)

				function loadDislikesBar(){
					if($('#dislikesBar').width() < dislikesPixels){
						$('#dislikesBar').width($('#dislikesBar').width() + 2);
						setTimeout(loadDislikesBar, 10)
					}
				}

			}
			$("#barContainer").fadeIn(2500);
		}
	}


//----------------------------------------------------------------------------//
// Handlers                                                                   //
//----------------------------------------------------------------------------//

	// Sets on click listener for have liked div to allow a relike
	$(document).delegate("div[id^='haveLikedDiv']", "click", function() {
		var el = this;
		changeLike($(el).attr('name'));
	});

	//Sets on click listener for like button of content
	$(document).delegate("div[id^='likeDiv']", "click", function() {
		var el = this;
		haveLikedOrDislikedObject(0, $(el).attr('name'), theUser);
	});

	//Sets on click listener for dislike button of content
	$(document).delegate("div[id^='dislikeDiv']", "click", function() {
		var el = this;
		haveLikedOrDislikedObject(1, $(el).attr('name'), theUser);
	});

	$(document).delegate("div[id^='loadMoreData']", "click", function() {
		loadMoreDataFromServer();      
	});

	$(document).delegate("div[id^='reloadContent']", "click", function() {
		getContent(theUser);   
	});

//----------------------------------------------------------------------------//
// OnClick Functions                                                          //
//----------------------------------------------------------------------------//

	// Fades in option to like or dislike
	function changeLike(contentNumber){
		$("#likesVsDislikesDiv_" + contentNumber).fadeOut(1000);
		$("#haveLikedDiv_" + contentNumber).fadeOut(1000, function(){
			$("#likeAndDislikeDiv_" + contentNumber).fadeIn(1000);
		});
	}


	// Function which handles a user liking or disliking a object
	function haveLikedOrDislikedObject(res, contentNumber, user){
		if(user != undefined){
			if(res == 0){
				$("#haveLikedDiv_" + contentNumber).text("Processing...");
				$.post("/likeContent", { content: contentNumber, user: user.UserID, isLike: 1 })
					.done(function(data) {
						var numLikes = data.numberOfLikes;
						displayHasLike(1, contentNumber, numLikes);
					})
					.fail(function() { $("#haveLikedDiv_" + contentNumber).text("Error liking this object..."); });
			} else{
				$.post("/likeContent", { content: contentNumber, user: user.UserID, isLike: 0 })
					.done(function(data) {
						var numLikes = data.numberOfLikes;
						displayHasLike(0, contentNumber, numLikes);
					})
					.fail(function() { $("#haveLikedDiv_" + contentNumber).text("Error liking this object..."); });		}
		} else{
			$("#haveLikedDiv_" + contentNumber).text("Sorry, something went wrong.");
		}
	};

	// Updates text to display that you like or dislike a content
	function displayHasLike(hasLike, contentNumber, numLikes){
		$("#likeAndDislikeDiv_" + contentNumber).fadeOut(400, function(){
			$("#haveLikedDiv_" + contentNumber).fadeIn(1000);
			$("#likesVsDislikesDiv_" + contentNumber).fadeIn(1000);
		});
		if(hasLike == 1)
			$("#haveLikedDiv_" + contentNumber).text("You like this.");
		else
			$("#haveLikedDiv_" + contentNumber).text("You dislike this.");


		if(numLikes > 0){
			$("#likesVsDislikesDiv_" + contentNumber).css('color','#279c38');
			$("#likesVsDislikesDiv_" + contentNumber).text('+'+numLikes);
		} else if(numLikes < 0) {
			$("#likesVsDislikesDiv_" + contentNumber).css('color','#c01e1e');
			$("#likesVsDislikesDiv_" + contentNumber).text(numLikes);
		} else{
			$("#likesVsDislikesDiv_" + contentNumber).css('color','#c01e1e');
			$("#likesVsDislikesDiv_" + contentNumber).text('0');
		}

		if(typeOfConnection == 2){
			$("#barContainer").fadeOut(400, function(){
				loadSingleBar();
			});
		}
	}

//----------------------------------------------------------------------------//
// Utilities                                                                  //
//----------------------------------------------------------------------------//
	// Function to get a random integer
	function getRandomInt (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getMySQLFormatDate(stringDate){
		var d = new Date(mostRecentContent.DateTime);
		var month = d.getMonth()+1;
		var year = d.getFullYear();
		var day = d.getDate();
		var hours = d.getHours();
		var minutes = d.getMinutes();
		var seconds = d.getSeconds();
		var dString = year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
		return dString;
	}

	function getContentImageString(con){
		if(con.FileName != "def.jpg")
			return '/public/images/' + con.ContentID + '-small.png';
		else
			return '/public/images/user/default.jpg';
	}

//----------------------------------------------------------------------------//
// Public member functions                                                    //
//----------------------------------------------------------------------------//
	return{
		initializeContentPage: function(tempUser){
			getContent(tempUser);
		},

		initializeContentForUser: function(tempUser){
			getContentForUser(tempUser);
		},

		initializeCategoryPage: function(tempcategory, tempUser){
			getContentForCategory(tempcategory, tempUser);
		},

		initializeSingleContentPage: function(tempUser, content){
			loadSingleContent(tempUser, content);
		}
	}
})();