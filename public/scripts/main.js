var host = "elseiff.com";

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
		}
	}

});

require([ "jquery-ui", "packagelist" ], function ( $ ) {

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


	/**
	 * 
	 *	function to link to the heart on package items
	 *
	 */
	window.heart = function () {
		var pkg = $(this).attr('data-package');

		$(this).toggleClass('fav', 80 )

		$.ajax({
			
			method : "POST",
			url : "http://" + host + "/api/user/favorites",
			data : { pkg : pkg },
			success : function ( data ) {
				console.log( data )
			},
			failure : function ( err ) {
				console.log( err )
			}
		});
	};
	

	// loading animation
	$( document ).ready( function () {

		$(".wireframe")
			.addClass("filled", 500, "easeOutBack" )
			.promise()
			.done( function () {

				require([ 'uiux', 'packagelist' ], function ( promises, PackageList ) {
						
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

									var deferred = $.Deferred();

									$(".page-item").promise().done( function () {
										deferred.resolve();
									});

									// create a PackageList with the query for the user's favorites
									new PackageList( favQuery, deferred )
								})
							}
						});
					});

					var deferred = $.Deferred();

					$(".page-item").promise().done( function () {
						deferred.resolve();
					});

					// create a PackageList with the query for ALL the packages
					new PackageList( query, deferred )

				});
			});
	});
});