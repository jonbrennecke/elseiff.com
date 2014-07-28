var host = "localhost:3000";


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

		uiux : {
			deps : [ 'jquery-ui' ]
		},

		wireframe : {
			deps : [ 'jquery-ui' ]
		}
	}
});


require([ "jquery-ui", "wireframe" ], function ( $, wfd ) {


	/**
	 * AJAX post request to retieve all packages
	 * ---
	 * the AJAX query for packages and the loading animations happen simultaneously,
	 * so that once the animations have finished, the query is completed
	 */
	var query = $.ajax({
		method : "GET",
		url : "http://" + host + "/api/find"
	});

	var url = document.URL.split( host ).slice( 1 )[0];

	
	$.when( wfd ).done( function () {

		require([ 'uiux', 'packagelist' ], function ( promises, PackageList ) {

			// TODO this seems kinda hacky, fix this in the future
			if ( /packages$/.test(url) ) {
				
				// sidebar favorites button is clicked	
				promises.sidebarItems.done( function () {
					$("#sb-favorites").click( function () {
						if ( this.dataset.action == "favorites" ) {
							
							var favQuery = $.ajax({
								method : "get",
								url : "http://" + host + "/api/user/favorites"
							});


							$(".page").fadeOut().promise().done( function () {

								$(this).empty().show()

								var d = $.Deferred();

								$(".page-item").promise().done( function () {
									d.resolve();
								});

								// create a PackageList with the query for the user's favorites
								new PackageList( favQuery, d )
							})
						}
					});
				});

				var d = $.Deferred();

				$(".page-item").promise().done( function () {
					d.resolve();
				});

				// create a PackageList with the query for ALL the packages
				new PackageList( query, d )

			}
		});
	});
});