// A function which returns a database object which has numerous
// prototypes for making queries to the database. 
function getDatabase(){
	
	// Sets up database
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		/*host     : 'likeordislike555.db.7757889.hostedresource.com',
		user     : 'likeordislike555',
	  	password : 'F2e2dfsd4sss!',
	  	database : 'likeordislike555',*/
	  host     : 'localhost',
	  user     : 'root',
	  password : 'ddnddn',
	  database : 'n23n7wfhs9a99dd3',
	});
	
	connection.connect(function(err) {
	});

	
	
	// The database object to be returned
	var db = {};
	
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

	// Function which gets a specific number of content ids from the database
	// Takes start number, number of rows, order, and a callback
	db.getContentIDs = function(start, num, order, callback) {
		var query = 'SELECT ContentID from Content ORDER BY ' + order +  ' LIMIT ' + start + ', ' + num;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContent - ' +err); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}

	db.getContentFromLoggedInUser = function(start, num, order, userID, callback){
		var query = 
		'SELECT '+
		'Content.ContentID, Content.UploaderID, Content.Title, Content.Ratio, Content.DateTime, Content.CategoryID,'+
		'Likes.UserID, Likes.IsLike, Likes.DateTime AS LikeDateTime,'+
		'ContentImages.ImageID, ContentImages.FileName, ContentImages.Height, ContentImages.Width '+
		'FROM Content '+
		'JOIN ContentImages ON ContentImages.ContentID = Content.ContentID '+
		'LEFT JOIN Likes ON Likes.ContentID = Content.ContentID '+
		'AND Likes.UserID='+userID+' '+
		'ORDER BY '+order+' DESC '+
		'LIMIT '+start+' , '+num;
		console.log(query);
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContentFromLoggedInUser - ' +err); callback(undefined); throw err;};
		  console.log(JSON.stringify(rows));
		  callback(rows);
	
		});
	}

	db.getContentForUser = function(start, num, order, userID, callback){
		var query = 
		'SELECT '+
		'Content.ContentID, Content.UploaderID, Content.Title, Content.Ratio, Content.DateTime, Content.CategoryID,'+
		'Likes.UserID, Likes.IsLike, Likes.DateTime AS LikeDateTime,'+
		'ContentImages.ImageID, ContentImages.FileName, ContentImages.Height, ContentImages.Width '+
		'FROM Content '+
		'JOIN ContentImages ON ContentImages.ContentID = Content.ContentID '+
		'JOIN Likes ON Likes.ContentID = Content.ContentID '+
		'AND Likes.UserID='+userID+' '+
		'ORDER BY '+order+' DESC '+
		'LIMIT '+start+' , '+num;
		console.log(query);
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContentFromLoggedInUser - ' +err); callback(undefined); throw err;};
		  console.log(JSON.stringify(rows));
		  callback(rows);
	
		});
	}

	// Function which gets a specific number of content for a specific category
	db.getContentForCategory = function(start, num, categoryID, order, callback) {
		var query = 
		'SELECT '+
		'Content.ContentID, Content.UploaderID, Content.Title, Content.Ratio, Content.DateTime, Content.CategoryID,'+
		'Likes.UserID, Likes.IsLike, Likes.DateTime AS LikeDateTime,'+
		'ContentImages.ImageID, ContentImages.FileName, ContentImages.Height, ContentImages.Width '+
		'FROM Content '+
		'JOIN ContentImages ON ContentImages.ContentID = Content.ContentID '+
		'LEFT JOIN Likes ON Likes.ContentID = Content.ContentID '+
		'WHERE Content.CategoryID='+categoryID+' '+
		'ORDER BY '+order+' '+
		'LIMIT '+start+' , '+num;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getCotent - ' +err); callback(undefined); throw err;};
		  
		  callback(rows);
	
		});
	}

	// Function which gets users info by the userID
	db.getUser = function(userID, callback) {
		var query = 'SELECT '+
					'Users.UserID, Users.Username, Users.DateTime, '+
					'BasicInfo.FirstName, BasicInfo.LastName, BasicInfo.Birthday, BasicInfo.Email, '+
					'BasicInfo.Country, BasicInfo.City '+
					' FROM Users JOIN BasicInfo ON Users.userID = BasicInfo.userID'+  
					' WHERE Users.UserID=' + userID + ' LIMIT 1';
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
		var query = 'SELECT '+
					'Users.UserID, Users.Username, Users.DateTime, '+
					'BasicInfo.FirstName, BasicInfo.LastName, BasicInfo.Birthday, BasicInfo.Email, '+
					'BasicInfo.Country, BasicInfo.City '+
					' FROM Users JOIN BasicInfo ON Users.UserID = BasicInfo.UserID'+  
					' WHERE Users.Username=? LIMIT 1';
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
	db.addContent = function(content, image, callback) {
		connection.query('INSERT INTO Content SET ?', content, function(err, result) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL');  throw err;};
		  image.ContentID = result.insertId;
		  
		  //Now calls for adding the image to the content image table
		  db.addContentImage(image, callback);
		});
	}
	
	// Function which adds content to the database
	db.addContentImage = function(image, callback) {
		connection.query('INSERT INTO ContentImages SET ?', image, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL');  throw err;};
		  	callback(image.ContentID);
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
	db.likeContent = function(obj, callback) {
		connection.query('INSERT INTO Likes SET ?', obj, function(err, result) {
			if (err){ 
				console.log('A duplicate like was attempted to be added -> '+ err);
				// If an error is thrown then attempt to update the row 
				db.updateLike(obj);
				db.getNumberOfLikes(obj.ContentID, callback);
			} else{	  
		  		db.getNumberOfLikes(obj.ContentID, callback);
		  	}
		});
	}

	// Updates a like row to be either a like or a dislike
	db.updateLike = function(obj) {
		if(obj != undefined){
			var query = 'UPDATE Likes SET IsLike='+obj.IsLike+' WHERE UserID='+obj.UserID
					  + ' AND ContentID='+obj.ContentID;
			connection.query(query, function(err, result) {
				if (err){ console.log('Something went wrong: ' +err); }
			});
		} 
	}

	db.getNumberOfLikes = function(contentID, callback) {
		var query = 'SELECT(SELECT COUNT(*) FROM Likes WHERE ContentID='+contentID+' AND IsLike=1)-'
				  + '(SELECT COUNT(*) from Likes WHERE ContentID='+contentID+' AND IsLike=0)'
				  + 'AS SumCount';
		connection.query(query, function(err, rows, fields) {
			if (err){ console.log('Error getting count for likes of content: '+ err); callback(undefined); 
			} else{	  
				callback(rows[0].SumCount);
				db.updateNumLikes(contentID, rows[0].SumCount);
		  	}
		});
	}

	// Updates a like row to be either a like or a dislike
	db.updateNumLikes = function(contentID, num) {
		if(num != undefined && contentID != undefined){
			var query = 'UPDATE Content SET Ratio='+num+' WHERE ContentID='+contentID;
			connection.query(query, function(err, result) {
				if (err){ console.log('Something went wrong: ' +err); }
			});
		} 
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