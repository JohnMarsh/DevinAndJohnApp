exports.login = function(req, res){
	if(req.session.username != undefined){
		res.redirect('/');
	} else{
		res.render("login.jade", { title: 'Login',  variable:{user: undefined} });
	}
};