/**
 *
 * ███████╗██╗     ███████╗███████╗██╗███████╗███████╗     ██████╗ ██████╗ ███╗   ███╗
 * ██╔════╝██║     ██╔════╝██╔════╝██║██╔════╝██╔════╝    ██╔════╝██╔═══██╗████╗ ████║
 * █████╗  ██║     ███████╗█████╗  ██║█████╗  █████╗      ██║     ██║   ██║██╔████╔██║
 * ██╔══╝  ██║     ╚════██║██╔══╝  ██║██╔══╝  ██╔══╝      ██║     ██║   ██║██║╚██╔╝██║
 * ███████╗███████╗███████║███████╗██║██║     ██║    ██╗  ╚██████╗╚██████╔╝██║ ╚═╝ ██║
 * ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝╚═╝     ╚═╝    ╚═╝   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝
 * 
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 * "db.js" - connects the server to the mongodb database
 * 
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// import Mongoose
var mongoose = require('mongoose');
	

/**
 *
 * The MongoDB username and password and the url to the mondogb database are passed as arguments
 * as the param "config"
 *
 */
module.exports = function ( config ) {

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Some event handlers
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	// mongodb error handler
	mongoose.connection.on("error", function ( err ) {
		
		if ( err.code == 18 ) { // authentication fail
			console.error( "ERROR >>> MongoDB authentication failed" );
			process.exit();
		}

		// otherwise demote the error to a warning
		else console.warn( err );
	});


	// once a connection is opened, display a message in console
	mongoose.connection.on( "open", function () {
		console.log( ">>> opened mongodb connection at " + config.url );
	});

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// try authenticating with the username and password given in the config file
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	mongoose.connect("mongodb://" + config.username + ":" + config.password + "@" + config.url );

	// finally, return the connection obect
	return mongoose.connection;
};

