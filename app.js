
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , upload = require('./routes/upload')
  , user = require('./routes/user')
  , db = require('./db')
  , http = require('http')
  , path = require('path')
  , im = require('imagemagick');
;
var app = express();
var fs = require('fs');


var  Alleup = require('alleup');
var alleup = new Alleup({storage : "aws", config_file: "alleup_config.json"})

app.configure(function(){
  app.set('port', process.env.PORT || 4006);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use("/public", express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat'}));
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res, next){
  routes.index(req, res, next);
});

app.get('/upload_content', upload.uploadContent);

app.get('/users/:user', user.userProfile);

app.post('/upload',  function(req, res) {
	var theDB = db.database();

	// get the temporary location of the file
    var tmp_path = req.files.theImage.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/images/' + req.files.theImage.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.theImage.size + ' bytes');
        });
    });
	
	
	// Function to create new object for content and content image and then send to database
	addToDatabase = function(width, height){
		// Generates a new content object to be put into the database
		var newContent = {
			Title: req.body.theName,
			UploaderID: 1,
			CategoryID: req.body.categories,
			Likes: 0,
			Dislikes: 0
		};
		
		var contentImage = {
			FileName: req.files.theImage.name,
			Height: height,
			Width: width
		};
		theDB.addContent(newContent, contentImage);

		console.log(contentImage.FileName + ' ' + contentImage.Height);
	};
	
	// Gets the correct width and height of the image
	im.identify(target_path, function(err, features){
		if (err) throw err
		addToDatabase(features.width, features.height);
	})
	
	res.redirect("/upload_content");
});

app.post("/login", function(req,res){
    db.login(req, req.body.username);
    res.redirect("/users");
});

app.post("/logout", function(req,res){
    db.logout(req);
    res.redirect("/");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


