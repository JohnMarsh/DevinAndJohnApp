exports.profile = function(req, res){
	console.log("Session username " + req.session.username);
	res.render("profile.jade", { username: req.session.username });
}
