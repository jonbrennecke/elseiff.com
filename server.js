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
 * the command line syntax to instantiate the server is as simple as:
 *
 * > npm start
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// load the confuration file
// ---
// The config.js file exports a JSON object containing some parameters and
// sensitive information such as passwords and secret keys. It is NOT part of the public github repository
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var config = require( __dirname + '/config' ),

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// require all the important node module
// Expressjs, MongoDB, Passport
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	express = require('express'),
	app = express(),
	router = express.Router(),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	MongoStore = require('connect-mongo')( session ),

	// require some local files
	User = require( __dirname + '/api/models/user'),
	db = require( __dirname + '/db.js' )( config.mongodb ),
	Version = require( __dirname + '/version' );

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// configure express
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.set('views', __dirname + '/public/jade/' );
app.set('view engine', 'jade');
app.engine( 'jade', require('jade').__express );
app.use( bodyParser() );
app.use( cookieParser( config.passport.secret ) ); // use the secret key from the config file
app.use( session({
	secret : process.env.npm_config_secret,
	cookie : {
		maxAge : 3600000
	},
	store : new MongoStore({
		mongoose_connection : db
	})
}));
app.use( passport.initialize() );
app.use( passport.session() );
app.use( '/api', router );
app.use( express.static( __dirname + '/public/') ); // TODO replace serving static files with NginX


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// set up Passport to serialize user sessions information for persistant sessions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
passport.serializeUser( function ( user, done ) {
	done(null, user.email );
});

passport.deserializeUser( function ( email, done ) {
	User.findOne({ email : email }, function (err, user) {
		done(err, user);
	});
});


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// set up Passport for our local authentication strategy
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
passport.use( new LocalStrategy(
	function ( username, password, done ) {

		User.findOne({ name: username }, function(err, user) {
			
			if ( err ) { return done( err ); }
			
			if ( ! user ) {
				return done(null, false, { message: 'Incorrect username.' });
			} 

			if ( ! user.checkPassword( password ) ) {
				return done(null, false, { message: 'Incorrect password.' });
			}

			return done(null, user);
		});
	}
));


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// set up the API router
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var api = require( __dirname + '/api/api' );
api.use( app, router );

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// set up the Page router
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var pages = require( __dirname + '/pages/pages' );
pages.use( app, passport );

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// finally, start the sever on the given port
// ---
// use the port from the configuration file, or default to 3000
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.listen( config.port || 3000 );

