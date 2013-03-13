// A function which returns a database object which has numerous
// prototypes for making queries to the database. 
function getDatabase(){
	
	// Sets up database
	var mysql  = require('mysql');
	var connection = mysql.createConnection({
		/*host     : 'likeordislike555.db.7757889.hostedresource.com',
		user     : 'likeordislike555',
	  	password : 'F2e2dfsd4sss!',
	  	database : 'likeordislike555',*/
	  host     : 'localhost',
	  user     : 'root',
	  password : 'lateralus',
	  database : 'n23n7wfhs9a99dd3',
	});

	var queues = require('mysql-queues');
	
	connection.connect(function(err) {
	});

    const DEBUG = true;
	queues(connection, DEBUG);


	
	
	// The database object to be returned
	var db = {};

	//function to register a user
	db.register = function(user){

		 console.log("In the registration function");


		var trans = connection.startTransaction();

		//inserting into the user list
		trans.query('INSERT INTO Users (Username, DateTime) VALUES (' +  "'" + user.username + "'" +  ', CURRENT_TIMESTAMP )',
		function(err, result) {
    		if(err){
    			console.log('ERROR CONNECTING TO MYSQL'); throw err;
        		trans.rollback();
        	}
    		else{
    			console.log("first query successful");

    			user.userId = result.insertId;
    			console.log(result.resultId);
    			trans.query('INSERT INTO BasicInfo (UserID, FirstName,	LastName, 	Email, 	Birthday, Country, City ) VALUES ('
    			 + "'" +  user.userId + "'" + ',' + "'" +  user.firstName + "'" +  ',' + "'" +  user.lastName + "'" +  ',' + "'" + 
    			  user.email + "'" +  ',' + "'" +  user.birthday + "'" +  ',' + "'" +  user.country + "'" +  ',' + "'" +  user.city + "'" +  ')',
	   			function(err, info) {
    				if(err){
    					console.log('ERROR CONNECTING TO MYSQL');  throw err;
        				trans.rollback();
       				}
    			else{
    				console.log("second query successful");

                	trans.query('INSERT INTO UserPassword (UserID, password) VALUES (' + "'" +  user.userId + "'" +  ',' + "'" +   user.password + "'" +  ')',
					function(err, info) {
    					if(err){
        					trans.rollback();
        				console.log('ERROR CONNECTING TO MYSQL');  throw err;
        				}	
    					else
    					    console.log("Third query successful");

            				trans.commit();
       					});
                	}
                });
            }
        });
    	console.log("before the execute");
    	trans.execute();
    
    }
	
	
	// Function which gets a specific number of users from the database
	// Takes start number, number of rows, order, and a callback
	db.getUsers = function(start, num, order, callback) {
		var query = 'SELECT * from Users ORDER BY ' + order +  ' LIMIT ' + start + ', ' + num;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}
	
	// Function which gets a specific number of content from the database
	// Takes start number, number of rows, order, and a callback
	db.getContent = function(start, num, order, callback) {
		var query = 'SELECT * from Content JOIN ContentImages ON Content.ContentID = ' +
		'ContentImages.ContentID ORDER BY ' + order +  ' LIMIT ' + start + ', ' + num;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getCotent - ' +err); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}

	// Function which gets a specific number of content for a specific category
	db.getContentForCategory = function(start, num, categoryID, order, callback) {
		var query = 'SELECT * from Content JOIN ContentImages ON Content.ContentID = ' +
		'ContentImages.ContentID WHERE Content.CategoryID=' + categoryID + ' ORDER BY ' + order +  ' LIMIT ' + start + ', ' + num;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getCotent - ' +err); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}

	// Function which gets users info by the userID
	db.getUser = function(userID, callback) {
		var query = 'SELECT * from Users JOIN BasicInfo ON Users.userID = BasicInfo.userID'  
		+' WHERE Users.UserID=' + userID + ' LIMIT 1';
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  if(rows!=undefined)
		  	callback(rows[0]);
		  else
		  	callback(undefined);
		});
	}

	// Function which gets users info by the userID
	db.getUserByUsername = function(username, callback) {
		var query = 'SELECT * from Users JOIN BasicInfo ON Users.userID = BasicInfo.userID'  
		+' WHERE Users.Username=? LIMIT 1';
		connection.query(query, [username], function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL: ' +err); callback(undefined); throw err;};
		  if(rows!=undefined)
		  	callback(rows[0]);
		  else
		  	callback(undefined);
		});
	}
	
	// Function which gets the stalker IDs of a user
	db.getUserStalkers = function(userID, callback) {
		var query = 'SELECT * from Stalkings WHERE StalkingID=' + userID;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}
	
	// Function which gets the stalking IDs of a user
	db.getUserStalkings = function(userID, callback) {
		var query = 'SELECT * from Stalkings WHERE StalkerID=' + userID;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}
	
	// Function which gets the likes of a user
	db.getUserLikes = function(userID, callback) {
		var query = 'SELECT * from Likes WHERE IsLike=1 AND UserID=' + userID;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}
	
	// Function which gets the dislikes of a user
	db.getUserDislikes = function(userID, callback) {
		var query = 'SELECT * from Likes WHERE IsLike=0 AND UserID=' + userID;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}
	
	// Function which gets users info by the userID
	db.getUserInfo = function(userID, callback) {
		var query = 'SELECT * from BasicInfo WHERE UserID=' + userID + ' LIMIT 1';
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}
	
	// Function which gets content info by the contentID
	db.getContentInfo = function(contentID, callback) {
		var query = 'SELECT * from Content WHERE ContentID=' + contentID + ' LIMIT 1';
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}
	
	// Function which gets the categores
	db.getCategories = function(callback) {
		var query = 'SELECT * from Categories';
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}

	// Function which gets a single categores
	db.getCategory= function(category, callback) {
		var query = 'SELECT * from Categories WHERE Name=?';
		connection.query(query, category, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL: ' +err); callback(undefined); throw err;};
		  if(rows != undefined)
		  	callback(rows[0]);
		  else
		  	callback(undefined)
	
		});
	}
	
	// Function which adds content to the database
	db.addContent = function(content, image) {
		connection.query('INSERT INTO Content SET ?', content, function(err, result) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL');  throw err;};
		  image.ContentID = result.insertId;
		  
		  //Now calls for adding the image to the content image table
		  db.addContentImage(image);
		});
	}
	
	// Function which adds content to the database
	db.addContentImage = function(image) {
		connection.query('INSERT INTO ContentImages SET ?', image, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL');  throw err;};
		  	
		});
	}
	
	// Function which gets specific content from the database by content ID
	db.getSpecificContent = function(contentID, callback) {
		connection.query('SELECT * FROM Content JOIN ContentImages ON Content.ContentID = ContentImages.ContentID' +
		'AND Content.ContentID =? LIMIT 1', contentID, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL');  throw err;};
		  if(rows != undefined)
		  	callback(rows[0]);		  
		  
		});
	}

	// Function which likes content
	db.getSpecificContent = function(obj, callback) {
		connection.query('INSERT INTO Likes SET ?', obj, function(err, rows, fields) {
			if (err){ console.log('ERROR CONNECTING TO MYSQL');  throw err;};	  
		  
		});
	}

	db.errorCheck = function(query){
		return true;
	}

	db.start = function(){
		connection.connect(function(err) {
			console.log("Erorr: Unable to bind connecting to database.")
		});
	}
	db.end = function(){
		connection.end(function(err) {
  		// The connection is terminated now
		});
	}
		
	return db;	
}



exports.database = getDatabase;
