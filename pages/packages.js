/**
 *
 * Currates all the pages
 *
 */

var Package = require( __dirname + "/../api/models/package" ),
	gravatar = require( __dirname + "/../gravatar" );

module.exports = {

	use : function ( app ) {

		app.get('/packages', function ( req, res ) {

			var data = {
				user : req.user ? gravatar.generate( req.user ) : gravatar.anon()
			}

			res.render( "packages-list", data );

		});

		app.get('/packages/:package', function ( req, res ) {

			var pkgName = ( req.url.split("/")[2] )

			Package.findOne({ name : pkgName }, function ( err, pkg ) {
				
				if ( err )
					res.redirect( "/404" )

				else {
					var data = {
						user : req.user ? gravatar.generate( req.user ) : gravatar.anon(),
						"package" : pkg 
					}

					res.render( "package", data );
				}

			});
		});

	}

}