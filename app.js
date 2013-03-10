
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
<<<<<<< HEAD
  , upload = require('./routes/upload')
  , user = require('./routes/user')
=======
  , user = require('./routes/user')
  , pages = require('./routes/pages')
>>>>>>> d404f171194eb6dcedaa55e5324406989df6bb7f
  , db = require('./db')
  , http = require('http')
  , path = require('path')
  , im = require('imagemagick');
;
var app = express();
var fs = require('fs');

<<<<<<< HEAD
=======
var theDb = db.database();
>>>>>>> d404f171194eb6dcedaa55e5324406989df6bb7f

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

<<<<<<< HEAD
app.get('/upload_content', upload.uploadContent);

app.get('/users/:user', user.userProfile);

app.post('/upload',  function(req, res) {
	var theDB = db.database();

=======
app.get('/upload_content', pages.uploadContent);

app.get('/user/:user', user.userProfile);
app.get('/users', user.users);

app.get('/category/:category', pages.category);
app.get('/categories', pages.categories)

app.post('/getContent', function(req, res){
  if(req.body.startNum != undefined && req.body.endNum != undefined){
    function doOtherStuff(content){
      res.send(content);
    }

    // Gets the categories from the database
    theDb.getContent(req.body.startNum, req.body.endNum, 'Content.DateTime', function(theContent) {
      doOtherStuff(theContent);
    });
  } else{
    res.send(undefined);
  }
});

app.post('/getContentForCategory', function(req, res){
  if(req.body.startNum != undefined && req.body.endNum != undefined && req.body.category!=undefined){
    function doOtherStuff(content){
      res.send(content);
    }

    // Gets the categories from the database
    theDb.getContentForCategory(req.body.startNum, req.body.endNum, req.body.category, 'Content.DateTime', function(theContent) {
      doOtherStuff(theContent);
    });
  } else{
    res.send(undefined);
  }
});

app.post('/getCategories', function(req, res){
  function doOtherStuff(cat){
    res.send(cat);
  }

    // Gets the categories from the database
  theDb.getCategories(function(theContent) {
    doOtherStuff(theContent);
  });
});

app.post('/upload',  function(req, res) {
>>>>>>> d404f171194eb6dcedaa55e5324406989df6bb7f
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


