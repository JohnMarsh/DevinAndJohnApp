loadMenuBar = function(user){
	if(user != undefined){
		$('#topBar').append("<p><a href='/'>Home</a> - "+
							"<a href='/newsfeed'>Newsfeed</a> - "+
							"<a href='/search'>Search</a> - "+
							"<a href='/categories'>Browse</a> - "+
							"<a href='/users'>Users</a> - "+
							"<a href='/upload_content'>Upload Content</a> - "+
							"<a href='/user/"+user.Username+"'>My Profile</a> - "+
							"<a href='/logout'>Logout</a></p>");
	} else{
		$('#topBar').append("<p><a href='/'>Home - </a>"+
							"<a href='/categories'>Categories - </a>"+
							"<a href='/users'>Users - </a>"+
							"<a href='/register'>Register - </a>"+
							"<a href='/login'>Login</a></p>");
	}
}