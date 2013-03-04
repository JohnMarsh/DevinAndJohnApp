
// A function which returns a database object which has numerous
// prototypes for making queries to the database. 
function theDatabase(){
	
	// Sets up database
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'ddnddn',
	  database : 'n23n7wfhs9a99dd3',
	});
	
	connection.connect();
	
	// The database object to be returned
	var db = {};
	
	// Function which gets a specific number of users from the databse
	// Takes start number, number of rows and a callback
	db.getUsers = function(start, num, callback) {
		var query = 'SELECT * from Users LIMIT ' + start + ', ' + num;
		connection.query(query, function(err, rows, fields) {
		  if (err){ console.log('ERROR CONNECTING TO MYSQL'); throw err;};
		  
		  callback(rows);
	
		});
	}
	
	return db;	
}

exports.index = function(req, res){
	console.log('Test');
	
	// Gets the database object
	db = theDatabase();
	
	// Performs a query for getting the first user
	db.getUsers(0, 1, function(theContent) {
		console.log('The content is: ', theContent[0]);
  	});
	
	res.render('index', { title: 'Hello' });
};