
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , register = require('./routes/register')
  , login = require('./routes/login')
  , pages = require('./routes/pages')
  , profile = require('./routes/profile')
  , db = require('./db')
  , http = require('http')
  , path = require('path')
  , bcrypt = require("bcrypt") //hashing algorithm
  , im = require('imagemagick')
  , MySQLSessionStore = require('connect-mysql-session')(express);

var app = express();
var fs = require('fs');

var theDb = db.database();

var Alleup = require('alleup');
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
  app.use(express.session({
     store: new MySQLSessionStore("n23n7wfhs9a99dd3", "root", "lateralus")
    ,secret: "keyboard cat"
    ,cookie: {maxAge: 60000 * 20} // 20 minutes
    }));
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

app.get('/upload_content', pages.uploadContent);

app.get('/user/:user', user.userProfile);

app.get('/users', user.users);

app.get('/register', register.register);

app.get('/login', login.login);


app.get('/profile', profile.profile);


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

app.post('/posts/likeContent', function(req, res){
  
  if(req.body.user != undefined && req.body.content != undefined){
    var obj = {
      UserID: req.body.user,
      ContentID: req.body.content,
      IsLike: 1
    };
    theDb.likeContent(obj, function(theContent) {
      
    });
  }
});

app.post('/upload',  function(req, res) {
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
		theDb.addContent(newContent, contentImage);

		console.log(contentImage.FileName + ' ' + contentImage.Height);
	};
	
	// Gets the correct width and height of the image
	im.identify(target_path, function(err, features){
		if (err) throw err
		addToDatabase(features.width, features.height);
	})
	
	res.redirect("/upload_content");
});

app.post("/register", function(req,res){

    var user = {
      username:  req.body.username,
      firstName: req.body.firstName,
      lastName:  req.body.lastName,
      email:     req.body.email,
      birthday:  req.body.birthday,
      country:   req.body.country,
      city:      req.body.city
    }
      //generate a salt, with 10 rounds (2^10 iterations)
    bcrypt.genSalt(10, function(err, salt) {
      //hash the given password using the salt we generated
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        console.log("in the hash callback " + hash);
        user.password = hash;  


        theDb.register(user); 

      }); 
    });
    
    res.redirect("/");
});

app.post("/login", function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var userId;

  console.log("finding userID with username:"  + username);


  //Search the Database for a User with the given username
  theDb.findUser(username, function(users){

    console.log("in the find user callback");

    console.log(" users is  "  + users);

    //we couldn't find a user with that name
    if(users === undefined){
      console.log("user was undefined ");
      res.redirect("/?error=invalid username or password"); 
      return;
    }
    else 
      console.log(" userID is:"  + users);
      userId = users;
      theDb.findPassword(userId, function(hash){
            //we couldn't find a user with that name
            if(password === undefined){
              console.log("password was undefined ");
              res.redirect("/?error=invalid username or password"); 
              return;
            }  
            else {
                console.log("password from database is " + hash );
                bcrypt.genSalt(10, function(err, salt) {
                  bcrypt.hash(password, salt, function(err, newhash) {
                    console.log("comparing " + newhash + " to " + hash);
                   });
                });
                bcrypt.compare(password, hash, function(err, authenticated){
                  if(authenticated){
                    console.log("was authenticated adding this username to session: " + username );
                    req.session.username = username;
                    res.redirect("/profile");
                  }else{
                    console.log("no password match");
                    res.redirect("/?error=invalid username or password"); 
                  }
                });
            }    
          });
    });
});

app.get("/logout", function(req, res){
  req.session.destroy(function(err){
      if(err){
          console.log("Error: %s", err);
      }
      res.redirect("/");
  }); 
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


