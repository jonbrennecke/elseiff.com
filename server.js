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

	db = require( __dirname + '/db.js' ),
	Version = require( __dirname + '/version' );



// express config
app.set('views', __dirname + '/public/jade/' );
app.set('view engine', 'jade');
app.engine( 'jade', require('jade').__express );
app.use( bodyParser() );
// app.use( cookieParser( process.env.npm_config_secret ) );
app.use( '/api', router );


// TODO replace serving static files with NginX
app.use( express.static( __dirname + '/public/') );


// pass to api manager
var api = require( __dirname + '/api/api' );
api.use( app, router );

// pass to pages manager
var pages = require( __dirname + '/pages/pages' );
pages.use( app );



app.listen( process.env.npm_config_port || 8081 );


