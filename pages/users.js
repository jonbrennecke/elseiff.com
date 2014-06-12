/**
 *
 * handles routing for user login/signup
 *
 * Endpoints:
 *	- /login - 
 *	- /signup - 
 * 	- /signout - ends session and redirects to home page
 */

var User = require( __dirname + '/../api/models/user');

module.exports = {
	
	use : function ( app, passport ) {

		app

			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			// LOGIN
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			.post( '/login', passport.authenticate('local', {
				successRedirect : "/",
				failureRedirect : "/login"
			}))
			.get( '/login', function ( req, res ) {

				if ( req.user ) res.redirect('/')
				else res.render( "auth", { login : true });

			})

			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			// SIGNIN
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			.get( '/signin', function ( req, res ) {

				res.redirect('/login')

			})

			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			// SIGNUP
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			.post('/signup', function ( req, res ) {

				// attach POST to user schema
				var user = new User({ 

					email: req.body.email, 
					password: req.body.password, 
					name: req.body.username 

				});
				
				// save in Mongo
				user.save( function ( err ) {
					if( err ) {
						console.warn(err);
					} else {

						req.login( user, function(err) {
							if (err) {
								console.log(err);
							}
							return res.redirect('/');
						});

					}
				});

			})
			.get( '/signup', function ( req, res ) {

				if ( req.user ) res.redirect('/')
				else res.render("auth");

			})

			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			// LOUGOUT
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			.get( '/logout', function ( req, res ) {

				res.redirect('/signout');

			})

			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			// SIGNOUT
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			.get( '/signout', function ( req, res ) {

				req.session.destroy( function ( err ) {
					res.redirect('/login');
				});

			});
	}
};