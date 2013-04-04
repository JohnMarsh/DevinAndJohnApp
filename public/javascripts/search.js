Search = (function(){
	var user;
	var pastKeyword = '';
	
	function setupSearchPage(tempUser){
		user = tempUser;
	}

	function handleDoneTyping(){
		var keyword = $('#keyword').val();
		if(keyword != pastKeyword && keyword != ''){
			$.post("/searchContent", { keyword: keyword })
			.done(function(data) {
				appendContentResults(data);
			});

			$.post("/searchUsers", { keyword: keyword })
			.done(function(data) {
				appendUserResults(data);
			});
		}

		if(keyword == ''){
			$('#results').hide();
		}
		pastKeyword = keyword;
	}

	function appendContentResults(results){
		if(results != undefined){
			$('#results').fadeIn(1000);
			$('#contentResults').empty();
			if(results.length >0){
				for(var i =0; i< results.length; i++)
					$('#contentResults').append('<p><a href="/content/'+results[i].ContentID+'">'+
						results[i].Title+'</a></p>');
			} else{
				$('#contentResults').append('<p>No content found</p>');
			}
		}
	}

	function appendUserResults(results){
		if(results != undefined){
					console.log(results.length);

			$('#results').fadeIn(1000);
			$('#userResults').empty();
			if(results.length >0){
				for(var i =0; i< results.length; i++)
					$('#userResults').append('<p>'+results[i].FirstName+' '+results[i].LastName+'<br><a href="/user/'+results[i].Username+'">'+
						results[i].Username+'</a></p><br>');
			} else{
				$('#userResults').append('<p>No users found</p>');
			}
		}
	}


	return{
		initializeSearchPage: function(vars){
			setupSearchPage(vars.user);
		},
		doneTyping: function(){
			handleDoneTyping();
		}
	}
})();
