NewsFeedFunctions = (function(){
	var user;
	var $container = $( '#container' );
	var items;
	var itemsOnPage=[];
	var currentItem = 0;
	var mostRecentContent;
	contentSet = {};
	continueLoadingUser = function(){
		$.post("/getNewsFeedForUser", {  })
		.done(function(data) {
			if(data!=undefined){
				items = data;
				mostRecentContent = data[0];
				handleLoadingContent();
			} else{
				
			}
		});
	}

	// Sets up massonry
	function handleLoadingContent(){
		//Loads masonry
		$( '#container' ).masonry( { itemSelector: '.item', 
			isFitWidth: true,
			isAnimated: true
		});

		$(window).scroll(function() {
			if ($(window).scrollTop() == $(document).height() - $(window).height()) {
				loadInContent();
			}
		});
		
		//Loads in content received from server
		loadInContent();
	}

	function loadInContent(){
		for(var i=currentItem; i<currentItem+50; i++){
			if(i >= items.length) break;
			appendNewsFeedItem(items[i]);
			if(i == currentItem+50-1){
				currentItem = currentItem+50;
				$( '#container' ).masonry('reload');			
				break;
			}
		}

	}

	function appendNewsFeedItem(item){
		if (!(item.ContentID in contentSet)) {
			contentSet[item.ContentID] = {};
			$boxes = getNewsFeedItem(item);
			itemsOnPage[itemsOnPage.length] = item;
			$( '#container' ).append( $boxes ).masonry( 'appended', $boxes );
		} else{
			contentSet[item.ContentID][item.Username] = true;
			//$( '#item-'+item.ContentID ).append('<p>'+item.Username+' also voted for this.</p>');
			//console.log("BA");
		}

	}

	function prependNewsFeedItem(item){
		$boxes = getNewsFeedItem(item);
		itemsOnPage[itemsOnPage.length] = item;
		$( '#container' ).prepend( $boxes ).masonry( 'appended', $boxes );
	}

	function getNewsFeedItem(item){
		var verb = 'liked';
			if(item.IsLike!=1){
				verb = 'disliked';
			}
		var tempString = '<div class="newsfeedItem item Newsfeed" style="width:100%;height:50px;" id="item-'+item.LikeID+'"><p><b>'+
							'<a href="/user/'+item.Username+'">'+item.Username+'</a> '+verb+' <a href="/content/'+item.ContentID+'">'
							+item.Title+'</a></b></p><p id="timeString-'+item.LikeID+'">'+getTimeString(item.DateTime)+'</p><br />';
		return $(tempString);
	}

	function loadMoreDataFromServer(){
		if(mostRecentContent != undefined){
			var d = getMySQLFormatDate(mostRecentContent.DateTime);
			$.post("/getMoreRecentActivity", { mostRecentContent: d })
			.done(function(data) {
				if(data!=''){
					mostRecentContent = data[0];
					for(var i=0; i< data.length; i++)
						prependNewsFeedItem(data[i]);
					$( '#container' ).masonry('reload');
				}
			});
		}
	}

	function updateTimeString(){
		for(var i=0; i < itemsOnPage.length; i++){
			$('#timeString-'+ itemsOnPage[i].LikeID).html(getTimeString(itemsOnPage[i].DateTime));
		}
	}


	setInterval(function() { 
		loadMoreDataFromServer();
		updateTimeString();
	}, 5000);

	
//----------------------------------------------------------------------------//
// Handlers                                                                   //
//----------------------------------------------------------------------------//

	$(document).delegate("div[id^='loadMoreItems']", "click", function() {
		loadMoreDataFromServer();      
	});

//----------------------------------------------------------------------------//
// Utilities                                                                  //
//----------------------------------------------------------------------------//
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

	function getTimeString(stringDate){
		var then = new Date(stringDate);
		var now = new Date();
		var elapsedInMS = now.getTime() - then.getTime();
		var d = new Date(elapsedInMS);
		if(elapsedInMS > 172800000)
			return Math.floor((elapsedInMS/86400000))+" days ago"
		else if(elapsedInMS >= 86400000 && elapsedInMS < 172800000)
			return "1 day ago.";
		else if(elapsedInMS < 86400000 && elapsedInMS >= 3600000)
			return Math.floor((elapsedInMS/3600000))+" hours ago"
		else if(elapsedInMS < 3600000 && elapsedInMS >= 120000)
			return Math.floor((elapsedInMS/60000))+" minutes ago"
		else if(elapsedInMS >= 60000 && elapsedInMS < 120000)
			return "1 minute ago"
		else if(elapsedInMS < 60000 && elapsedInMS > 2000)
			return Math.floor((elapsedInMS/1000))+" seconds ago"
		else
			return "Just now"
	}



	return{
		loadNewsFeed: function(usr){
			user = usr;
			continueLoadingUser();
		}
	}
})();