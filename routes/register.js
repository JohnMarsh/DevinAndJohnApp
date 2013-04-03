exports.register = function(req, res){
if(req.session.username != undefined){
		res.redirect('/');
	} else{
		res.render("register.jade", { title: 'Registration',  variable:{user: undefined} });
	}
}
