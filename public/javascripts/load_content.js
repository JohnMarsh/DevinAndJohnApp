// Does the initial load for content
<<<<<<< HEAD
function loadInContent(options, theUser, masonryContainer){
	console.log(theUser);
	for(var i = 0; i < options.length; i++) {
		var content = options[i];
		appendContent(content, masonryContainer);
=======
function loadInContent(theUser, masonryContainer){

	//Sends post request to server to get content
	$.post("/getContent", { startNum: 0, endNum: 100 })
	.done(function(data) {
		if(data != undefined)
	  		continueLoading(data, masonryContainer);
	  	else
	  		noMoreData(masonryContainer);
	});
}

// Does the initial load for content for a category
function loadInContentForCategory(category, user, masonryContainer){
	if(category != undefined && user != undefined){
		//Sends post request to server to get content
		$.post("/getContentForCategory", { startNum: 0, endNum: 100, category: category.CategoryID })
		.done(function(data) {
			if(data != undefined)
		  		continueLoading(data, masonryContainer);
		  	else
		  		noMoreData(masonryContainer);
		});
	} else{
		noMoreData(masonryContainer);
	}
}

function continueLoading(data, masonryContainer){
	console.log(theUser);
	for(var i = 0; i < data.length; i++) {
		var content = data[i];
		appendContent(content, masonryContainer);
		masonryContainer.masonry('reload')
>>>>>>> d404f171194eb6dcedaa55e5324406989df6bb7f
	}			
	masonryContainer.masonry('reload')
}

<<<<<<< HEAD
function appendContent(content, masonryContainer){
	var el = document.createElement("option");
	var imageHeight = (190/content.Width) * content.Height;
=======
function noMoreData(masonryContainer){
	appendNoMoreDataWarning(masonryContainer);
	masonryContainer.masonry('reload')
}

function appendNoMoreDataWarning(masonryContainer){
	var theString = '<div class="item Wide centeredInDiv dislikeDiv" style="height:40px;'
	+ 'width: 500px; background-color: #903;">'
	+'Sorry, no more data.</div>';
	var $boxes = $(theString);
	masonryContainer.append( $boxes ).masonry( 'appended', $boxes );
}

function appendContent(content, masonryContainer){
	var el = document.createElement("option");
	var imageWidth;
	var imageHeight;
	if(content.Height > 0.8*content.Width){
		imageHeight = (160/content.Width) * content.Height;
		imageWidth = 160;
	} else if(content.Height > 0.5*content.Width && content.Height < 0.8*content.Width){
		imageWidth = getRandomInt(140,180);
		imageHeight = (imageWidth/content.Width) * content.Height;
	} else{
		imageWidth = getRandomInt(180,240);
		imageHeight = (imageWidth/content.Width) * content.Height;
	}

	//var imageHeight = (190/content.Width) * content.Height;
>>>>>>> d404f171194eb6dcedaa55e5324406989df6bb7f
	var bottomHeight = 80;
	var contentHeight = imageHeight + bottomHeight;

	var theString = '<div class="item Wide" style="height:' + contentHeight 
<<<<<<< HEAD
		+'px"><img class="contentImg" src="/public/images/' + content.FileName + '"/><br/>' 
=======
		+'px; width: +' + imageWidth + ';"><img class="contentImg" width="'+ imageWidth +'" src="/public/images/' + content.FileName + '"/><br/>' 
>>>>>>> d404f171194eb6dcedaa55e5324406989df6bb7f
		+ content.Title+'<br/>' + getBottom(content) + '</div>';
	var $boxes = $(theString);
	masonryContainer.append( $boxes ).masonry( 'appended', $boxes );
}

<<<<<<< HEAD

function getBottom(content){
	if(content != undefined){
		likesToDislikes = content.Likes - content.Dislikes;
=======
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getBottom(content){
	if(content != undefined){

		// Gets the ratio of likes to dislikes
		var likesToDislikes = content.Likes - content.Dislikes;
		var likesColorClass;
		if(likesToDislikes>0){
			likesColorClass = 'greenP';
		} else if(likesToDislikes<0){
			likesColorClass = 'redP';
		} else{
			likesColorClass = 'redP';
			likesToDislikes = 'No likes/dislikes';
		}

>>>>>>> d404f171194eb6dcedaa55e5324406989df6bb7f
		returnS = '<center> <div id="likeAndDislikeDiv_' + content.ContentID +'">'
        +'<div class="centeredInDiv likeDiv" id="likeDiv_' + content.ContentID +'" name="' + content.ContentID +'">like</div>'
        +'<div class="centeredInDiv spacerDiv" id="spacerDiv_' + content.ContentID +'" name="' + content.ContentID +'"></div>'
        +'<div class="centeredInDiv dislikeDiv" id="dislikeDiv_' + content.ContentID +'" name="' + content.ContentID +'">dislike</div>'
<<<<<<< HEAD
    	+'</div>'
		+'<div class="centeredInDiv haveLikedDiv" id="haveLikedDiv_' + content.ContentID +'" name="' + content.ContentID +'"></div>'
    	+'<div class="centeredInDiv likesVsDislikesDiv" id="likesVsDislikesDiv_' + content.ContentID +'" name="' + content.ContentID +'">' + 
    	likesToDislikes + '</div>';
=======
    	+'</div></center>'
    	+'<div>'
		+'<div class="centeredInDiv haveLikedDiv" id="haveLikedDiv_' + content.ContentID +'" name="' + content.ContentID +'"></div>'
    	+'<div class="centeredInDiv likesVsDislikesDiv" id="likesVsDislikesDiv_' + content.ContentID +'" name="' + content.ContentID +'">' 
    	+'<p class="'+likesColorClass+'">' + likesToDislikes + '</p></div>'
    	+'</div>';
>>>>>>> d404f171194eb6dcedaa55e5324406989df6bb7f
		
		return returnS;	
	}
	return "";	
}

// Function which handles a user liking or disliking a object
function haveLikedOrDislikedObject(res, contentNumber){
	$("#likeAndDislikeDiv_" + contentNumber).fadeOut(400, function(){
		$("#haveLikedDiv_" + contentNumber).fadeIn(1000);
		$("#likesVsDislikesDiv_" + contentNumber).fadeIn(1000);
	});
	//$("#likesVsDislikesDiv_" + contentNumber).text("+114");
	if(res == 0){
		//$.post("likeordislike.php", { id: "1", action: "1" } );
		$("#haveLikedDiv_" + contentNumber).text("You like this.");
	} else{
		//$.post("likeordislike.php", { id: "1", action: "2" } );
		$("#haveLikedDiv_" + contentNumber).text("You dislike this.");
	}
};