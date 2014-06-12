/**
 *
 * mbot
 *
 *
 * RESTful API
 *
 * endpoints:
 *
 *
 */



var express = require('express'),
	app = express(),
	router = express.Router(),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	MongoStore = require('connect-mongo')( session ),

	User = require( __dirname + '/api/models/user'),
	db = require( __dirname + '/db.js' ),
	Version = require( __dirname + '/version' );



// express config
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

// TODO replace serving static files with NginX
app.use( express.static( __dirname + '/public/') );

/**
 *
 * passport requires these functions to serialize user info for a persistant session
 *
 */

passport.serializeUser( function ( user, done ) {
	done(null, user.email );
});

passport.deserializeUser( function ( email, done ) {
	User.findOne({ email : email }, function (err, user) {
		done(err, user);
	});
});


// set up passport for local authentication
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


// pass to api manager
var api = require( __dirname + '/api/api' );
api.use( app, router );

// pass to pages manager
var pages = require( __dirname + '/pages/pages' );
pages.use( app, passport );



app.listen( process.env.npm_config_port || 8081 );


