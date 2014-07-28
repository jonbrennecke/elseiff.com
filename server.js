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
 * the command line syntax to instantiate the server is:
 *
 * > npm --user=$USERNAME --pass=$PASSWORD --secret=$SECRET --port=3000 start
 *
 * where:
 *	$USERNAME - the MongoDB username
 *  $PASSWORD - the MongoDB password
 *	$SECRET - cookie secret key
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// require all the important node module
// Expressjs, MongoDB, Passport
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var express = require('express'),
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
	db = require( __dirname + '/db.js' ),
	Version = require( __dirname + '/version' );

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// configure express
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.set('views', __dirname + '/public/jade/' );
app.set('view engine', 'jade');
app.engine( 'jade', require('jade').__express );
app.use( bodyParser() );
app.use( cookieParser( process.env.npm_config_secret ) );
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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.listen( process.env.npm_config_port || 8081 );


