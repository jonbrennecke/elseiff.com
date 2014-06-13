var User = require( __dirname + "/models/user" ),
	Package = require( __dirname + "/models/package" ),
	log = require( __dirname + "/logging" );


module.exports = {
	
	use : function ( app, router ) {

		router.route( '/user' )

			/**
			 *
			 * GET to /user returns a JSON object containing the User Schema
			 *
			 */

			.get( function ( req, res ) {
				if ( req.user ) {
					User.findById( req.user._id, function ( err, user ) {
						if ( err )
							res.send( log.get( "serverError", err ) )
						else
							res.send( log.get( "ok", user ) )
					})
				}
				else
					res.send( log.get( "notFound", req.body ) )
			})


		router.route( '/user/favorites' )

			/**
			 *
			 * POST to /user/favorites updates the user's favorites with the package
			 *
			 */
			 
			.post( function ( req, res ) {

				if ( req.user && req.body.pkg ) {
					User.findByIdAndUpdate( req.user._id, { $addToSet : { favorites : req.body.pkg } }, function ( err, user ) {
						if ( err )
							res.send( log.get( "serverError", err ) )
						else
							res.send( log.get( "ok", user ) )
					})
				}
				else
					res.send( log.get( "notFound", req.body ) )

			})


		router.route( '/find' )


			/**
			 *
			 * GET to /find returns a JSON object containing all packages matching a criteria
			 *
			 */
			.post( function ( req, res ) {

				// req.body
				Package.find( req.body, function ( err, pkgs ) {

					if ( err )
						res.send( log.get( "serverError", err ) );
					else
						res.send( log.get( "ok", pkgs ) );

				});	


			});

			

		// INSTALL
		router.route( '/install' )

			/**
			 *
			 * GET to /install returns a JSON object containing information about the packages repository
			 *
			 */
			.get( function ( req, res ) {
				
				Package.findOne({ name : req.body.pkg }, function ( err, pkg ) {

					// if a package is found, return it's repository info
					if ( err )
						res.send( log.get( "notFound", err ) );
					else
						res.send( log.get( "ok", pkg.repository ) );

				});


			})


		// PUBLISH
		router.route( '/publish' )

			/**
			 *
			 * POST to /publish registers a package in the DB
			 *
			 */
			.post( function ( req, res ) {

				// check if the POSTed data looks like a valid mbot.json
				if ( req.body.data && req.body.data instanceof Object ) {

					Package.findOne({ name : req.body.pkg }, function ( err, pkg ) {

						// if a package by this name already exists, we need to compare
						// versions to see if we should update the package
						if ( pkg ) {
							
							if ( new Version( req.body.data.version ).newer( pkg.version ) ) {

								// it's a newer version, so update the package
								pkg.update( req.body.data, function ( err ) {
									
									if ( err )
										res.send( log.get( "serverError", err ) );
									else
										res.send( log.get( "ok", pkg ) );
								});

							}
							else if ( new Version( req.body.data.version ).equals( pkg.version ) ) {
								res.send( log.get( "notModified", "A package by the same name and version " + 
									"already exists.\nIf you are the creator of the \"" + req.body.pkg +
									"\" package and are trying to update it, please increment the version number first."  ) );
							}
							else {
								res.send( log.get( "notModified", "a package by the same name already exists" ) );
							}

						}

						// couldn't find a package (matching the name), so create a new one
						else {
							
							var pkg = new Package( req.body.data );

							pkg.save( function ( err ) {

								if( err )
									res.send( log.get( "serverError", err.toString() ) );

								else
									res.send( log.get( "created", "created package" ) );

							});
						}

					});

				}

				// no (or bad) 'data' field associated with the package
				else
					res.send( log.get( "badRequest", "invalid \"package.json\"" ) );

			});

	}

}
