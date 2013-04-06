
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , pages = require('./routes/pages')
  , register = require('./routes/register')
  , login = require('./routes/login')
  , profile = require('./routes/profile')
  , db = require('./db')
  , http = require('http')
  , path = require('path')
  , bcrypt = require("bcrypt") //hashing algorithm
  , MySQLSessionStore = require('connect-mysql-session')(express)
  , im = require('imagemagick')
  , cronJob = require('cron').CronJob;
var app = express();
var fs = require('fs');

var theDb = db.database();

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
  app.use(express.session({
     store: new MySQLSessionStore("n23n7wfhs9a99dd3", "root", "ddnddn")
    ,secret: "keyboard cat"
    ,cookie: {maxAge: 60000 * 60} // 60 minutes
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
app.get('/users/:num', user.users);

app.get('/editProfile', user.editProfile);
app.get('/uploadPP', user.uploadPP);

app.get('/register', register.register);

app.get('/category/:category', pages.category);
app.get('/categories', pages.categories);
app.get('/content/:content', pages.contentPage);
app.get('/search', pages.search);


app.get('/login', login.login);
app.get('/myProfile', profile.profile);
app.get('/newsfeed', pages.newsfeed);

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



app.post('/searchContent', function(req, res){
  if(req.body.keyword != undefined && req.session.userid != undefined){
    function doOtherStuff(content){
      res.send(content);
    }
    // Searches the database for the specific keyword
    theDb.searchContent(req.body.keyword, req.session.userid, function(rows){
      doOtherStuff(rows);
    });
  } else{
    res.send(undefined);
  }
});

app.post('/searchUsers', function(req, res){
  if(req.body.keyword != undefined && req.session.userid != undefined){
    function doOtherStuff(content){
      res.send(content);
    }
    // Searches the database for the specific keyword
    theDb.searchUsers(req.body.keyword, function(rows){
      doOtherStuff(rows);
    });
  } else{
    res.send(undefined);
  }
});

app.post('/getLikesAndDislikes', function(req, res){
  if(req.body.content != undefined){
    function doOtherStuff(content){
      res.send(content);
    }
    // Gets the categories from the database
    theDb.getLikesAndDislikes(req.body.content, function(theContent) {
      doOtherStuff(theContent);
    });
  } else{
    res.send(undefined);
  }
});

app.post('/deleteUserImage', function(req, res){
  if(req.body.user.UserID){
    function doOtherStuff(content){
      res.send(content);
    }
    // Gets the categories from the database
    theDb.deleteUserImage(req.session.userid, function(theContent) {
      doOtherStuff(theContent);
    });
  } else{
    res.send(undefined);
  }
});

// Gets the content joined with if the user as liked table
app.post('/getContentFromUser', function(req, res){
  if(req.body.startNum != undefined && req.body.endNum != undefined && req.session.userid != undefined){
    function doOtherStuff(content){
    
      res.send(content);
    }

    /*// Gets the content 
    theDb.getContentFromLoggedInUser(req.body.startNum, req.body.endNum, 'Content.DateTime', req.session.userid, function(theContent) {
      doOtherStuff(theContent);
    });*/

    theDb.getTrendingContentFromLoggedInUser(req.body.startNum, req.body.endNum, req.session.userid, function(theContent) {
      doOtherStuff(theContent);
    });
  } else{
    res.send(undefined);
  }
});

// Checks if user is stalking another user
app.post('/userIsStalkingUser', function(req, res){
  if(req.body.user != undefined && req.session.userid != undefined){
    callback = function(result){
      res.send(result);
    }
    theDb.userIsStalkingUser(req.session.userid, req.body.user, callback);
  } else{
    res.send(false);
  }
});

// Stalks a given user
app.post('/stalkUser', function(req, res){
  if(req.body.user != undefined && req.session.userid != undefined){
    callback = function(result){
      console.log("Sendinf stalk");
      res.send(result);
    }
    console.log("stalk: "+req.session.userid+" and : "+req.body.user);
    theDb.stalkUser(req.session.userid, req.body.user, callback);
  } else{
          console.log("Failed stalk");

    res.send(false);
  }
});

// Stalks a given user
app.post('/unstalkUser', function(req, res){
  if(req.body.user != undefined && req.session.userid != undefined){
    callback = function(result){
      res.send(result);
    }
    theDb.unstalkUser(req.session.userid, req.body.user, callback);
  } else{
    res.send(false);
  }
});

// Updates user info for a user
app.post('/saveProfileInfo', function(req, res){
  if(req.body.info != undefined && req.session.userid != undefined){
    callback = function(result){
      res.send(result);
    }
    theDb.updateBasicInfo(req.session.userid, req.body.info, callback);
  } else{
    res.send(false);
  }
});

app.post('/getNewsFeedForUser', function(req, res){
  if(req.session.userid != undefined){
    callback = function(result){
      res.send(result);
    }
    theDb.getNewsFeedForUser(req.session.userid, callback);
  } else{
    res.send(false);
  }
});

// Gets new content after a point of time
app.post('/getMoreRecentContentFromUser', function(req, res){
  if(req.body.mostRecentContent != undefined && req.session.userid != undefined){
    function doOtherStuff(content){
      res.send(content);
    }

    // Gets the content 
    theDb.getMoreContentFromLoggedInUser(req.body.mostRecentContent, req.session.userid, function(theContent) {
      doOtherStuff(theContent);
    });
  } else{
    console.log("Error");
    res.send(undefined);
  }
});

// Gets new activity for a news feed after a point of time
app.post('/getMoreRecentActivity', function(req, res){
  if(req.body.mostRecentContent != undefined && req.session.userid != undefined){
    function doOtherStuff(content){
      res.send(content);
    }

    // Gets the content 
    theDb.getMoreActivity(req.body.mostRecentContent, req.session.userid, function(theContent) {
      doOtherStuff(theContent);
    });
  } else{
    console.log("Error");
    res.send(undefined);
  }
});

// Gets the content for a specific users activity
app.post('/getContentForUser', function(req, res){
  if(req.body.startNum != undefined && req.body.endNum != undefined && req.body.userID != undefined){
    function doOtherStuff(content){
    
      res.send(content);
    }

    // Gets the content
    theDb.getContentForUser(req.body.startNum, req.body.endNum, 'Likes.DateTime', req.body.userID, function(theContent) {
      doOtherStuff(theContent);
    });
  } else{
    res.send(undefined);
  }
});

app.post('/getContentForCategoryFromUser', function(req, res){
  if(req.body.startNum != undefined && req.body.endNum != undefined && req.body.category!=undefined
    && req.session.userid){
    function doOtherStuff(content){
      res.send(content);
    }

    // Gets the categories from the database
    theDb.getContentForCategory(req.body.startNum, req.body.endNum, req.body.category, 'Content.DateTime', 
      req.session.userid, function(theContent) {
      doOtherStuff(theContent);
    });
  } else{
    res.send(undefined);
  }
});

app.post('/getStalkersForUser', function(req, res){
  if(req.body.userID != undefined){
    function doOtherStuff(stalkers){
      res.send(stalkers);
    }

      // Gets the categories from the database
    theDb.getUserStalkers(req.body.userID, function(theContent) {
      doOtherStuff(theContent);
    });
  } else{
    res.send(undefined);
  }
});

app.post('/getStalkingsForUser', function(req, res){
  if(req.body.userID != undefined){
    function doOtherStuff(stalkers){
      res.send(stalkers);
    }

      // Gets the categories from the database
    theDb.getUserStalkings(req.body.userID, function(theContent) {
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

app.post('/likeContent', function(req, res){
    console.log('->'+JSON.stringify(req.session));

  sendBack = function(numberOfLikes){
    var sendObj = {
      numberOfLikes: numberOfLikes
    }
    res.send(sendObj);
  }
  
  if(req.session.userid != undefined && req.body.content != undefined && req.body.isLike != undefined){
    var obj = {
      UserID: req.session.userid,
      ContentID: req.body.content,
      IsLike: req.body.isLike,
    };
    theDb.likeContent(obj, function(numberOfLikes) {
      sendBack(numberOfLikes);
    }); 
  } else{
    res.send(undefined);
  }
});

app.post('/upload',  function(req, res) {
  var isError = false;
  if(req.files.theImage.name != undefined){
  	// get the temporary location of the file
      var tmp_path = req.files.theImage.path;
      // set where the file should actually exists - in this case it is in the "images" directory
      var target_path = './public/images/' + req.files.theImage.name;
      // move the file from the temporary location to the intended location
      fs.rename(tmp_path, target_path, function(err) {
          if (err) {isError=true; return;}
          // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
          fs.unlink(tmp_path, function() {
              if (err) {isError=true; return;}
              res.send('File uploaded to: ' + target_path + ' - ' + req.files.theImage.size + ' bytes');
          });
      });
  	
  	
  	// Function to create new object for content and content image and then send to database
  	addToDatabase = function(width, height){
  		// Generates a new content object to be put into the database
  		var newContent = {
  			Title: req.body.theName,
  			UploaderID: req.session.userid,
  			CategoryID: req.body.categories,
  			Likes: 0,
  			Dislikes: 0,
        Ratio: 0
  		};
  		
  		var contentImage = {
  			FileName: req.files.theImage.name,
  			Height: height,
  			Width: width
  		};

      function convertImage(id){
        im.resize({
        srcPath: __dirname+'/public/images/'+req.files.theImage.name,
        dstPath: __dirname+'/public/images/'+id+'-small.png',
        width:   200
        }, function(err, stdout, stderr){
          if (err) {isError=true; return;}
        });
      }

  		theDb.addContent(newContent, contentImage, convertImage);

  		console.log(contentImage.FileName + ' ' + contentImage.Height);
  	};
  	
  	// Gets the correct width and height of the image
  	im.identify(target_path, function(err, features){
  		if (err) {isError=true; return;}
  		addToDatabase(features.width, features.height);
  	});
  	
    if(!isError)
  	 res.redirect("/upload_content");
    else
      sendErrorPage(res, "Unable to upload file");
  } else{
    sendErrorPage(res, "Unable to upload file");
  }
});

app.post('/uploadUserImage',  function(req, res) {
  var isError = false;
  if(req.files.theImage.name != undefined){
  	// get the temporary location of the file
      var tmp_path = req.files.theImage.path;
      // set where the file should actually exists - in this case it is in the "images" directory
      var target_path = './public/images/user/' + req.files.theImage.name;
      // move the file from the temporary location to the intended location
      fs.rename(tmp_path, target_path, function(err) {
          if (err) {isError=true; console.log(err); return;}
          // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
          fs.unlink(tmp_path, function() {
              if (err) {isError=true; console.log(err); return;}
              //res.send('File uploaded to: ' + target_path + ' - ' + req.files.theImage.size + ' bytes');
          });
      });
  	
  	
  	// Function to create new object for content and content image and then send to database
  	addToDatabase = function(width, height){	
  	console.log('in add to database');	
  		var contentImage = {
  			FileName: req.files.theImage.name,
  			Height: height,
  			Width: width,
  			UserID: req.session.userid
  		};

  		callback = function(){
  			res.send(true)
  		}

  		theDb.addUserImage(contentImage, function(result){
  			res.send(result);
  		});

  		console.log(contentImage.FileName + ' ' + contentImage.Height);
  	};
  	
  	// Gets the correct width and height of the image
  	im.identify(target_path, function(err, features){
  		if (err) {isError=true; console.log(err); console.log(err); return;}
  		addToDatabase(features.width, features.height);
  	});
  	
    if(!isError){
    	 console.log('no err');
  	 res.redirect("/uploadPP");
    }else
      sendErrorPage(res, "Unable to upload file");
  } else{
    sendErrorPage(res, "Unable to upload file");
  }
});

function sendErrorPage(res, err){
	console.log("error");
  res.redirect("/error");
}

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
                    req.session.userid= userId;
                    res.redirect("/");
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

//Cron job for updating the database
var job = new cronJob({
  cronTime: '* * * * * *', // every second
  onTick: function() {
    theDb.orderTrending(function(result){
      if(result === undefined){
        console.log("an error has occured calling cron job");
      }
    });
  }
});
job.start();




///////
// Functions for testing and demo purposes

/*
randomLikes = function(){
    //for(var i=1; i<100000; i++){
      doDaStuff = function(){
        var obj = {
            UserID: getRandomInt(500,3000),
            ContentID: getRandomInt(548,6000),
            IsLike: getRandomInt(0,1),
          };
          theDb.likeContent(obj, function(numberOfLikes) {
            
          });
      }
      setTimeout(function(){
        doDaStuff();
        randomLikes();
      }, getRandomInt(100,500));   
   // }
  //for(var z=0; z<content.length; z++){
   // theDb.getNumberOfLikes(content[z].ContentID, function(){});
  //}
}


//randomLikes();

//theDb.getContentIDs(0,1000,'ContentID', randomLikes);

randomUsers = function(){
  for(var i = 0; i<400000; i++){
    var user={
      username:  makeid(),
      password:  makeid(),
      firstName: makeid(),
      lastName:  "",
      email:     "test@gmail.com",
      birthday:  "2011-09-29",
      country:   "Canada",
      city:      "Ottawa"
    }
    theDb.register(user);
  }
}

stalkUsers = function(){
  for(var i=500; i<3000; i++){
    theDb.stalkUser(28570, i, function(){});
  }
}

//stalkUsers();

  randomContent = function(){
    // Generates a new content object to be put into the database
    for(var i=0; i<5000; i++){
      var newContent = {
        Title: makeid(),
        UploaderID: getRandomInt(1000, 4000),
        CategoryID: getRandomInt(1, 12),
        Likes: 0,
        Dislikes: 0,
        Ratio: 0
      };
      
      var contentImage = {
        FileName: "def.jpg",
        Height: 1,
        Width: 1
      };

      function convertImage(id){
        console.log("Created: "+id);
      }
      
      theDb.addContent(newContent, contentImage, convertImage);

      console.log("DONE");
    };
  }

  //randomContent();

//randomUsers();

function makeid()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < getRandomInt(4,10); i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
}*/


