// Does the initial load for content
function loadInContent(options, theUser, masonryContainer){
	console.log(theUser);
	for(var i = 0; i < options.length; i++) {
		var content = options[i];
		appendContent(content, masonryContainer);
	}			
	masonryContainer.masonry('reload')
}

function appendContent(content, masonryContainer){
	var el = document.createElement("option");
	var imageHeight = (190/content.Width) * content.Height;
	var bottomHeight = 80;
	var contentHeight = imageHeight + bottomHeight;

	var theString = '<div class="item Wide" style="height:' + contentHeight 
		+'px"><img class="contentImg" src="/public/images/' + content.FileName + '"/><br/>' 
		+ content.Title+'<br/>' + getBottom(content) + '</div>';
	var $boxes = $(theString);
	masonryContainer.append( $boxes ).masonry( 'appended', $boxes );
}


function getBottom(content){
	if(content != undefined){
		likesToDislikes = content.Likes - content.Dislikes;
		returnS = '<center> <div id="likeAndDislikeDiv_' + content.ContentID +'">'
        +'<div class="centeredInDiv likeDiv" id="likeDiv_' + content.ContentID +'" name="' + content.ContentID +'">like</div>'
        +'<div class="centeredInDiv spacerDiv" id="spacerDiv_' + content.ContentID +'" name="' + content.ContentID +'"></div>'
        +'<div class="centeredInDiv dislikeDiv" id="dislikeDiv_' + content.ContentID +'" name="' + content.ContentID +'">dislike</div>'
    	+'</div>'
		+'<div class="centeredInDiv haveLikedDiv" id="haveLikedDiv_' + content.ContentID +'" name="' + content.ContentID +'"></div>'
    	+'<div class="centeredInDiv likesVsDislikesDiv" id="likesVsDislikesDiv_' + content.ContentID +'" name="' + content.ContentID +'">' + 
    	likesToDislikes + '</div>';
		
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