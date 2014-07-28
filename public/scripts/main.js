/**
 *
 * ███████╗██╗     ███████╗███████╗██╗███████╗███████╗     ██████╗ ██████╗ ███╗   ███╗
 * ██╔════╝██║     ██╔════╝██╔════╝██║██╔════╝██╔════╝    ██╔════╝██╔═══██╗████╗ ████║
 * █████╗  ██║     ███████╗█████╗  ██║█████╗  █████╗      ██║     ██║   ██║██╔████╔██║
 * ██╔══╝  ██║     ╚════██║██╔══╝  ██║██╔══╝  ██╔══╝      ██║     ██║   ██║██║╚██╔╝██║
 * ███████╗███████╗███████║███████╗██║██║     ██║    ██╗  ╚██████╗╚██████╔╝██║ ╚═╝ ██║
 * ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝╚═╝     ╚═╝    ╚═╝   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝
 * 
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 * front-end pages
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// by default the website is hosten on port 3000
var host = "localhost:3000";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// set up the require.js configuration
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// to do anything useful we'll need jquery ui and the wireframe deffered object
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
require([ "jquery-ui" ], function ( $ ) {

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// TODO check data attribute to load the next part
	// we don't need to make this API request for every page
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// var article = document.querySelector('#electriccars'),
	// article.dataset.wireframe;
	// if ( )

	// // if the page uses the wireframe, load it seperately
	// require(["wireframe"], function ( wfd ) {

	// });

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// 
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	require(["wireframe"],function ( wfd ) {
		$.when( wfd ).done( function () {

			require([ 'uiux', 'packagelist' ], function ( promises, PackageList ) {

				var url = document.URL.split( host ).slice( 1 )[0];

				// TODO this seems kinda hacky, fix this in the future
				if ( /packages/.test(url) ) {
					
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

					// create a PackageList with the query for ALL the packages
					new PackageList( query, d )
				}
			});
		});
	});
});