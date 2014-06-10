/**
 *
 * Currates all the pages
 *
 */

module.exports = {

	use : function ( app ) {
	
		app.get('/', function ( req, res ){
		
			res.render( "index" );

		});

	}

}