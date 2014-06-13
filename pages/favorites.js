var gravatar = require( __dirname + "/../gravatar" );

module.exports = {

	use : function ( app, passport ) {
		
		app.get('/favorites', function ( req, res ) {

			var data = {
				user : req.user ? gravatar.generate( req.user ) : gravatar.anon()
			}

			res.render( "favorites", data );

		});

	}

}