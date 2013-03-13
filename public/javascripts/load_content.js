LoadContentFunctions = (function(){


	var currentNumberOfContent = 0;
	var maxNumberOfContent = 1000;
	var currentTotalContent = 0;
	var isNoMoreData = false;
	var content;
	var theUser;

	//The type of load content happening
	//0 = Content for homepage, user signed in
	//1 = Content for user profile
	//Else = User not signed in
	var typeOfConnection;

	function getContent(tempUser){
		$.post("/getContentFromUser", { startNum: 0, endNum: maxNumberOfContent, userID: tempUser.UserID })
		.done(function(data) {
			currentTotalContent = data.length;
			content = data;
			theUser = tempUser;
			typeOfConnection = 0;
			handleLoadingContent();
		});
	}

	function getContentForUser(tempUser){
		$.post("/getContentForUser", { startNum: 0, endNum: maxNumberOfContent, userID: tempUser.UserID })
		.done(function(data) {
			currentTotalContent = data.length;
			content = data;
			theUser = tempUser;
			typeOfConnection = 1;
			handleLoadingContent();
		});
	}

	function getContentForCategory(category, tempUser){
		$.post("/getContentForCategory", { startNum: 0, endNum: maxNumberOfContent, category: category.CategoryID })
		.done(function(data) {
			currentTotalContent = data.length;
			content = data;
			theUser = tempUser;
			typeOfConnection = 0;
			handleLoadingContent();
		});
	}

	// Does the initial load for content
	function loadInContent(masonryContainer){
		if(content != undefined && currentNumberOfContent != currentTotalContent)
			continueLoading(masonryContainer);
		else{
			noMoreData(masonryContainer);
		}
	}

	function continueLoading(masonryContainer){
		for(var i = currentNumberOfContent; i < currentNumberOfContent+14; i++) {
			var tempcontent = content[i];
			if(tempcontent == undefined) {
				currentNumberOfContent = i; 
				noMoreData(masonryContainer);
				break; 
			}
			appendContent(tempcontent, masonryContainer);
			
			if(tempcontent.IsLike != null)
				displayHasLike(tempcontent.IsLike, tempcontent.ContentID, tempcontent.Ratio);
			masonryContainer.masonry('reload')
		}
		currentNumberOfContent = i;			
		masonryContainer.masonry('reload')
	}

	function noMoreData(masonryContainer){
		if(!isNoMoreData){
			appendNoMoreDataWarning(masonryContainer);
			masonryContainer.masonry('reload')
		}
		isNoMoreData = true;
	}

	function appendNoMoreDataWarning(masonryContainer){
		var theString = '<div class="item Wide centeredInDiv dislikeDiv" style="height:40px;'
		+ 'width: 100%; background-color: #903; vertical-align: middle;">'
		+'Sorry, no more data.</div>';
		var $boxes = $(theString);
		masonryContainer.append( $boxes ).masonry( 'appended', $boxes );
	}

	function appendContent(content, masonryContainer){
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
		masonryContainer.append( $boxes ).masonry( 'appended', $boxes );
	}

	function getRandomInt (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getTop(content){
		var imageWidth;
		var imageHeight;

		/*  Uncomment for scattered layout 
		if(content.Height > 0.8*content.Width){
			imageHeight = (160/content.Width) * content.Height;
			imageWidth = 160;
		} else if(content.Height > 0.5*content.Width && content.Height < 0.8*content.Width){
			imageWidth = getRandomInt(140,180);
			imageHeight = (imageWidth/content.Width) * content.Height;
		} else{
			imageWidth = getRandomInt(180,240);
			imageHeight = (imageWidth/content.Width) * content.Height;
		}*/

		imageWidth = 200;
		imageHeight = (200/content.Width) * content.Height;

		//var imageHeight = (190/content.Width) * content.Height;
		var bottomHeight = 80;
		var contentHeight = imageHeight + bottomHeight;

		var theString = '<div class="item Wide" style="height:' + contentHeight 
			+'px; width: +' + imageWidth + ';"><img class="contentImg" id="ContentImage_'+content.ContentID 
			+'" width="'+ imageWidth +'" src="/public/images/' + content.ContentID + '-small.png"/><br/>' 
			+ content.Title+'<br/>';
		return theString;
	}


	function getBottomForConnectionType0(content){
		if(content != undefined){

			// Gets the ratio of likes to dislikes
			var likesToDislikes = content.Likes - content.Dislikes;			

			returnS = '<center> <div id="likeAndDislikeDiv_' + content.ContentID +'">'
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


	// TODO: Add pop up window when content is clicked  
	//Sets on click listener for dislike button of content
	/*$(document).delegate("img[id^='ContentImage']", "click", function() {
		var el = this;
		var contentID = $(el).attr('name');
		$form = $('<div class="contentDisplay" style="height:400px;width:300px; "></div>');
		$form.bPopup({
			contentContainer:'.contentDisplay',
	        loadUrl: '/categories' //Uses jQuery.load()
	    });      
		
	});*/

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

		$("#likesVsDislikesDiv_" + contentNumber).text(numLikes);
	}

	function handleLoadingContent(){
		//Loads masonry
		$( '#container' ).masonry( { itemSelector: '.item', 
			isFitWidth: true,
			isAnimated: true

		});

		$(window).scroll(function() {
			if ($(window).scrollTop() == $(document).height() - $(window).height()) {
				loadInContent($('#container'));
			}
		});
		
		//Loads in content received from server
		loadInContent($('#container'));
	}

	return{
		initializeContentPage: function(tempUser){
			getContent(tempUser);
		},

		initializeContentForUser: function(tempUser){
			getContentForUser(tempUser);
		},

		initializeCategoryPage: function(tempcategory, tempUser){
			getContentForCategory(tempcategory, tempUser);
		}
	}
})();