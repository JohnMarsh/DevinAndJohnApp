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
	  database : 'other',//n23n7wfhs9a99dd3',
	});

	var queues = require('mysql-queues');
	
	connection.connect(function(err) {
	});

	const DEBUG = false;
	queues(connection, DEBUG);

	var moment = require('moment');
	moment().format();

	
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

    db.findUser = function(username, callback){
		var query = 'SELECT'+
					' UserID'+
					' FROM Users'+  
					' WHERE Users.Username=? LIMIT 1';
		  connection.query(query, [username], function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  	if(rows!=undefined){
		  		if(rows[0] != undefined)
		  			callback(rows[0].UserID);
		  		else
		  			callback(undefined);
		  }
		  else
		  	  callback(undefined);
		});
	}

    db.findPassword = function(userID, callback){
				var query = 'SELECT'+
					' Password'+
					' FROM UserPassword'+  
					' WHERE UserPassword.UserID=? LIMIT 1';
		  connection.query(query, [userID], function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  if(rows != undefined){
		  	callback(rows[0].Password);
		  }	
		  else{
		  	callback(undefined);
		  }	
		});
	}

	db.userIsStalkingUser = function(stalker, stalking, callback){
		var query = 'SELECT'+
					' *'+
					' FROM Stalkings'+  
					' WHERE StalkerID='+stalker+' AND StalkingID='+stalking+' LIMIT 1';
		connection.query(query, function(err, rows, fields) {
			if (err){ console.log('ERROR CONNECTING TO MYSQL: '+err); callback(false); throw err;
			} else{
			  if(rows[0] != undefined){
			  	callback(true);
			  }else
			  	callback(false);
			}
		});
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
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getCotent - ' +err); callback(undefined);};
		  
		  callback(rows);
	
		});
	}

	// Function which gets a specific number of content ids from the database
	// Takes start number, number of rows, order, and a callback
	db.getContentIDs = function(start, num, order, callback) {
		var query = 'SELECT ContentID from Content ORDER BY ' + order +  ' LIMIT ' + start + ', ' + num;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContent - ' +err); callback(undefined);};
		  
		  callback(rows);
	
		});
	}

	// Function which gets all user ids from datavase
	db.getUserIDs = function(callback) {
		var query = 'SELECT UserID FROM Users';
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContent - ' +err); callback(undefined);};
		  
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
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContentFromLoggedInUser - ' +err); callback(undefined); throw err;};
		  callback(rows);
	
		});
	}

	db.getSingleContentFromLoggedInUser = function(contentID, userID, callback){
		var query = 
		'SELECT '+
		'Content.ContentID, Content.UploaderID, Content.Title, Content.Ratio, Content.DateTime, Content.CategoryID,'+
		'Likes.UserID, Likes.IsLike, Likes.DateTime AS LikeDateTime,'+
		'ContentImages.ImageID, ContentImages.FileName, ContentImages.Height, ContentImages.Width '+
		'FROM Content '+
		'JOIN ContentImages ON ContentImages.ContentID = Content.ContentID '+
		'LEFT JOIN Likes ON Likes.ContentID = Content.ContentID '+
		'AND Likes.UserID='+userID+' '+
		'WHERE Content.ContentID ='+contentID+' '+
		'LIMIT 1';
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContentFromLoggedInUser - ' +err); callback(undefined); throw err;};
		  callback(rows[0]);
	
		});
	}

	// Gets content added after a datetime
	db.getMoreContentFromLoggedInUser = function(date, userID, callback){
		var query = 
		'SELECT '+
		'Content.ContentID, Content.UploaderID, Content.Title, Content.Ratio, Content.DateTime, Content.CategoryID,'+
		'Likes.UserID, Likes.IsLike, Likes.DateTime AS LikeDateTime,'+
		'ContentImages.ImageID, ContentImages.FileName, ContentImages.Height, ContentImages.Width '+
		'FROM Content '+
		'JOIN ContentImages ON ContentImages.ContentID = Content.ContentID '+
		'LEFT JOIN Likes ON Likes.ContentID = Content.ContentID '+
		'AND Likes.UserID='+userID+' '+
		'WHERE Content.DateTime >\"'+ date+'\"';
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContentFromLoggedInUser - ' +err); callback(undefined); throw err;};

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
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContentFromLoggedInUser - ' +err); callback(undefined); throw err;};
		  callback(rows);
	
		});
	}

	db.deleteUserImage = function(userID, callback){
		var query = 
		'DELETE FROM UserImages WHERE UserID = ' + userID;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContentFromLoggedInUser - ' +err); callback(false); throw err;};
		  callback(true);
		});
	}

	db.addUserImage = function(data, callback){
		var query = 
		'INSERT INTO UserImages SET ?';
		connection.query(query, [data], function(err, rows, fields) {
		  if (err){ db.updateUserImage(data, callback) };
		  callback(true);
		});
	}

	db.updateUserImage = function(data, callback){
		var query = 
			'UPDATE UserImages SET ? WHERE UserID = ' +data.UserID;
		connection.query(query, [data], function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContentFromLoggedInUser - ' +err); callback(false); throw err;};
		  callback(true);
		});
	}


	db.getTrendingContentFromLoggedInUser = function(start, num, userID, callback){
		var query = 
		'SELECT '+
		'Content.ContentID, Content.UploaderID, Content.Title, Content.Ratio, Content.DateTime, Content.CategoryID,'+
		'Likes.UserID, Likes.IsLike, Likes.DateTime AS LikeDateTime,'+
		'ContentImages.ImageID, ContentImages.FileName, ContentImages.Height, ContentImages.Width '+
		'From Trending '+
		'JOIN Content ON Content.ContentID=Trending.ContentID '+
		'JOIN ContentImages ON ContentImages.ContentID = Content.ContentID '+
		'LEFT JOIN Likes ON Likes.ContentID = Content.ContentID '+
		'AND Likes.UserID='+userID+' '+
		'ORDER BY Trending.Score '+
		'LIMIT '+start+' , '+num;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getContentFromLoggedInUser - ' +err); callback(undefined); throw err;};
		  callback(rows);
	
		});
	}

	// Function which gets a specific number of content for a specific category
	db.getContentForCategory = function(start, num, categoryID, order, userID, callback) {
		var query = 
		'SELECT '+
		'Content.ContentID, Content.UploaderID, Content.Title, Content.Ratio, Content.DateTime, Content.CategoryID,'+
		'Likes.UserID, Likes.IsLike, Likes.DateTime AS LikeDateTime,'+
		'ContentImages.ImageID, ContentImages.FileName, ContentImages.Height, ContentImages.Width '+
		'FROM Content '+
		'JOIN ContentImages ON ContentImages.ContentID = Content.ContentID '+
		'LEFT JOIN Likes ON Likes.ContentID = Content.ContentID '+
		'AND Likes.UserID='+userID+' '+
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
					'BasicInfo.Country, BasicInfo.City, UserImages.FileName, UserImages.Width, UserImages.Height '+
					' FROM Users JOIN BasicInfo ON Users.userID = BasicInfo.userID'+
					' LEFT JOIN UserImages ON Users.userID = UserImages.userID'+  
					' WHERE Users.UserID=' + userID + ' LIMIT 1';
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  if(rows!=undefined)
		  	callback(rows[0]);
		  else
		  	callback(undefined);
		});
	}

	// Function which gets users info by the username
	db.getUserByUsername = function(username, callback) {
		var query = 'SELECT '+
					'Users.UserID, Users.Username, Users.DateTime, '+
					'BasicInfo.FirstName, BasicInfo.LastName, BasicInfo.Birthday, BasicInfo.Email, '+
					'BasicInfo.Country, BasicInfo.City, UserImages.FileName, UserImages.Height, UserImages.Width '+
					'FROM Users JOIN BasicInfo ON Users.UserID = BasicInfo.UserID '+
					'LEFT JOIN UserImages ON Users.UserID = UserImages.UserID '+  
					'WHERE Users.Username=? LIMIT 1';
		connection.query(query, [username], function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL: ' +err); callback(undefined); throw err;};
		  if(rows!=undefined)
		  	callback(rows[0]);
		  else
		  	callback(undefined);
		});
	}

	// Function which gets users id info by the username
	db.getUserIDByUsername = function(username, callback) {
		var query = 'SELECT'+
					' UserID'+
					' FROM Users'+  
					' WHERE Users.Username=? LIMIT 1';
		connection.query(query, [username], function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL: ' +err); callback(undefined); throw err;};
		  if(rows!=undefined){
		  	if(rows[0] != undefined)
		  		callback(rows[0].UserID);
		  	else
		  		callback(undefined);
		  }else
		  	callback(undefined);
		});
	}
	
	// Function which gets the stalker IDs of a user
	db.getUserStalkers = function(userID, callback) {
		var query = 'SELECT * from Stalkings '+
					'JOIN Users ON Stalkings.StalkerID=Users.UserID '+
					'WHERE StalkingID=' + userID;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  callback(rows);	
		});
	}

	db.stalkUser = function(stalker, stalking, callback){
		var query = 'INSERT INTO Stalkings '+
					'SET StalkerID='+stalker+
					', StalkingID='+stalking;
		connection.query(query, function(err, result) {
			if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(false);
			} else{
		  		callback(true);
		  	}	
		});
	}

	db.unstalkUser = function(stalker, stalking, callback){
		var query = 'DELETE FROM Stalkings '+
					'WHERE StalkerID='+stalker+
					' AND StalkingID='+stalking;
		connection.query(query, function(err, result) {
			if (err){ console.log('ERROR CONNECTING TO MYSQL: '+err); callback(false); 
			} else{
		  		callback(true);	
		  	}
		});
	}
	
	// Function which gets the stalker IDs of a user
	db.getUserStalkings = function(userID, callback) {
		var query = 'SELECT * from Stalkings '+
					'JOIN Users ON Stalkings.StalkingID=Users.UserID '+
					'WHERE StalkerID=' + userID;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  console.log("going to call callback");
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
			var query = 'UPDATE Likes SET IsLike='+obj.IsLike+', DateTime=NOW() WHERE UserID='+obj.UserID
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

	db.getLikesAndDislikes = function(contentID, callback) {
		var query = 'SELECT * FROM (SELECT COUNT(*) AS Likes FROM Likes WHERE ContentID='+contentID+' AND IsLike=1) AS LIKESTABLE '
				  + 'JOIN (SELECT COUNT(*) AS Dislikes from Likes WHERE ContentID='+contentID+' AND IsLike=0) '
				  + 'AS DISLIKESTABLE';
		connection.query(query, function(err, rows, fields) {
			if (err){ console.log('Error getting count for likes of content: '+ err); callback(undefined); 
			} else{	  
				callback(rows[0]);
		  	}
		});
	}

	// Updates a like row to be either a like or a dislike
	db.updateNumLikes = function(contentID, num) {
		if(num != undefined && contentID != undefined){
			var query = 'UPDATE Content SET Ratio='+num+' WHERE ContentID='+contentID;
			connection.query(query, function(err, result) {
				if (err){ console.log('Something went wrong updating num likes: ' +err); }
			});
		} 
	}

	// Updates the basic info for a user
	db.updateBasicInfo = function(user, info, callback) {
		var query = 'UPDATE BasicInfo SET ? WHERE UserID='+user;
		connection.query(query, [info], function(err, result) {
			if (err){ console.log('Something went wrong updating basic info: ' +err); callback(false); }
			callback(true);
		});
	}

	db.getNewsFeedForUser = function(user, callback){
		console.log("Going in");
		db.getUserStalkings(user, function(rows){
			var query = 'SELECT Likes.IsLike, Likes.DateTime, Likes.UserID, Likes.ContentID, '+
						'Content.Title, Users.Username, Likes.LikeID FROM Likes '+ 
						'JOIN Content ON Likes.ContentID = Content.ContentID '+
						'JOIN Users ON Users.UserID=Likes.UserID WHERE';
			for(var i = 0; i<rows.length; i++){
				query = query + " Likes.UserID="+rows[i].StalkingID+" ";
				if(i != rows.length-1){
					query = query + "OR";
				}
			}
			query = query + 'ORDER BY Likes.DateTime DESC LIMIT 1000';
			connection.query(query, function(err, rows, fields) {
				if (err){ console.log('Error getting news feed for user: '+ err); callback(undefined); 
				} else{	  
					callback(rows);
			  	}
			});
		});
	}

	// Gets activity occurring after a datetime
	db.getMoreActivity = function(date, userID, callback){
		db.getUserStalkings(userID, function(rows){
			var query = 'SELECT Likes.IsLike, Likes.DateTime, Likes.UserID, Likes.ContentID, '+
						'Content.Title, Users.Username FROM Likes '+ 
						'JOIN Content ON Likes.ContentID = Content.ContentID AND Likes.DateTime>\"'+ date+'\"'+
						'JOIN Users ON Users.UserID=Likes.UserID WHERE';
			for(var i = 0; i<rows.length; i++){
				query = query + " Likes.UserID="+rows[i].StalkingID+" ";
				if(i != rows.length-1){
					query = query + "OR";
				}
			}
			query = query + '';
			connection.query(query, function(err, rows, fields) {
			  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.getMoreActivity - ' +err); callback(undefined); throw err;};
			  callback(rows);
		
			});
		});
	}

	// Searches for a user given a keyword
	db.searchUsers = function(keyword, callback){
		if(!db.onlyHasCharsAndDigits(keyword)){
			callback(undefined);
			return;
		}
		var query = 'SELECT * '+
					'FROM  `Users` '+
					'JOIN BasicInfo ON BasicInfo.UserID = Users.UserID '+
					'WHERE ( '+
					'Users.Username LIKE  \'%'+keyword+'%\' '+
					'OR BasicInfo.FirstName LIKE  \'%'+keyword+'%\' '+
					'OR BasicInfo.LastName LIKE  \'%'+keyword+'%\' '+
					') '+
					'LIMIT 50';
					console.log(query);
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.searchUser - ' +err); callback(undefined); throw err;};
		  callback(rows);
		});
	}

	// Searches for a user given a keyword
	db.searchContent = function(keyword, userID, callback){
		if(!db.onlyHasCharsAndDigits(keyword)){
			callback(undefined);
			return;
		}
		var query = 'SELECT '+
					'Content.ContentID, Content.UploaderID, Content.Title, Content.Ratio, Content.DateTime, Content.CategoryID,'+
					'Likes.UserID, Likes.IsLike, Likes.DateTime AS LikeDateTime,'+
					'ContentImages.ImageID, ContentImages.FileName, ContentImages.Height, ContentImages.Width '+
					'FROM Content '+
					'JOIN ContentImages ON ContentImages.ContentID = Content.ContentID '+
					'LEFT JOIN Likes ON Likes.ContentID = Content.ContentID '+
					'AND Likes.UserID='+userID+' '+
					'WHERE ( '+
					"Content.Title LIKE  '%"+keyword+"%' "+
					') '+
					'LIMIT 50';
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL for db.searchContent - ' +err); callback(undefined); throw err;};
		  callback(rows);
		});
	}


	//-------------Trending algorithm function---------------

	//function to get the trending score of content based on ratio and age
	var getTrendScore = function(content){

		//console.log("computing score....")


		var constDate = moment("Jan 1 2013"); // constant date 
		var age = moment(content.date); //age of content
		var t = age - constDate;
		var s = content.ratio; // ratio of likes to dislikes

		//This log is implemented so that the first 10 likes carry the same weight as the next 100 likes
		var order = log10(Math.max(Math.abs(s), 1), 10); 

		var sign;

		if(s > 0){
			sign = 1;
		}
		else{
			sign = -1;
		}

		return Math.round(order + sign * t / 45000);
	}

	var log10 = function (val) {
  		return Math.log(val) / Math.LN10;
	}

	//---------------Data base reordering functions--------------------

	db.orderTrending = function(callback){

		//console.log("computing trending....")

		var getNewestContentQuery = "SELECT * FROM Content ORDER BY ContentID DESC LIMIT 1000"

		connection.query(getNewestContentQuery, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		  	//console.log("Length of rows is: " + rows.length);
		  	for(var i = 0; i < rows.length; i++){
		  		var content = {
		  				ratio: rows[i].Ratio,
		  				id: rows[i].ContentID,
		  				date: rows[i].DateTime
		  		}
		  		content.score = getTrendScore(content);
		  		//console.log("Ratio: " + content.ratio +" ID: "+ content.id +" Score: " + content.score);
		  		

		  		var insertQuery = "INSERT INTO Trending (Score, ContentID) VALUES (?,?) ON DUPLICATE KEY UPDATE ContentID = " + content.id;
		  		connection.query(insertQuery, [content.score, content.id], function(err, rows, fields) {
		 			 if (err){ console.log('ERROR CONNECTING TO MYSQL'); callback(undefined); throw err;};
		 		}); 
		  	}
		});


	}

	db.onlyHasCharsAndDigits = function(s){
		var Regx = /^[A-Za-z0-9.]*$/;
     	return(Regx.test(s));
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