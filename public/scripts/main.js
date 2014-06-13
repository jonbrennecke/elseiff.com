requirejs.config({

	paths : {

		jquery : "bower_components/jquery/dist/jquery.min",

		"jquery-ui" : "bower_components/jquery-ui/ui/minified/jquery-ui.min"

	},

	shim : {
		jquery : {
			exports : "$"
		},

		"jquery-ui" : {
			exports : '$',
			deps : [ 'jquery' ]
		},

		"uiux" : {
			deps : [ 'jquery-ui' ]
		}
	}

});

require([ "jquery-ui"], function ( $ ) {

	// AJAX post request to retieve all packages
	// ---
	// the AJAX query for packages and the loading animations happen simultaneously,
	// so that once the animations have finished, the query is completed
	var query = $.ajax({
		method : "POST",
		url : "http://localhost:8081/api/find"
	});
	


	// loading animation
	$( document ).ready( function () {

		$(".wireframe")
			.addClass("filled", 500, "easeOutBack" )
			.promise()
			.done( function () {

				require([ 'uiux', 'package-anims' ], function ( promise, fun ) {
						
					promise.done( fun.bind( this, query ) );

				});
			});
	});
});