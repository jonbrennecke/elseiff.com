/**
 *
 * Currates all the pages
 *
 */

var packages = require( __dirname + "/packages" ),
	users = require( __dirname + "/users" ),
	// favorites = require( __dirname + "/favorites" ),
	gravatar = require( __dirname + "/../gravatar" );

module.exports = {

	use : function ( app, passport ) {
	
		app.get('/', function ( req, res ) {
			
			var data = {
				user : req.user ? gravatar.generate( req.user ) : gravatar.anon()
			}

			res.render( "index", data );

		});

		packages.use( app, passport );

		users.use( app, passport );

		// favorites.use( app, passport );

	}

}