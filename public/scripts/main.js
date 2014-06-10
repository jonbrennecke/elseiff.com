

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

				$(".title").fadeIn()

				$( ".sidebar-item" ).show().each( function ( i ) {
					$(this).delay( 50 * i ).addClass( "filled", 700, "easeOutQuint" )
				})
				
				$( ".header-item" ).delay(400).show().each( function ( i ) {
					$(this).delay( 50 * i).addClass( "filled", 700, "easeOutBack" )
				})

				$( ".page-item" ).show().each( function ( i ) {
					$(this).delay( 150 * i ).addClass( "filled", 700, "easeOutQuint" )
				})
				.promise()
				.done( function () {
					
					$(".preload-wrap").fadeIn(200).promise().done( function () {
						query.done( function ( pkgs ) {

							var preloads = $(".preload-wrap");

							for (var i = 0; i < Math.max(pkgs.message.length, preloads.length); i++) {

								// find the i-th preload element and fade it out
								if ( preloads.get(i) ) {
									var pre = $( preloads.get(i) )
										.fadeOut(200)
										

									if ( i < pkgs.message.length ) {
										
										var keywords = "<ul class='keywords'>";

										pkgs.message[i].keywords.forEach( function ( key ) {
											keywords += "<li>" + key + "</li>";
										});

										pre.parent()
											.append("<div class='loaded-wrap'>" + 
													"<p class='name'>" + pkgs.message[i].name + "</p>" +
													"<p class='author'>" + pkgs.message[i].author + "</p>" +
													"<p class='description'>" + pkgs.message[i].description + "</p>" +
													keywords + "</ul></div>" )
									}
									else {

										// there may be fewer packages than preloads
										// in which case, fadeOut the remaining preloads
										pre.parent().delay(100).fadeOut(500)
									}

									pre.promise().done( function () {
										$(this).parent().find(".loaded-wrap").fadeIn(200)
									});

								}
								else {

									// there are more packages than preloads, so
									// make another .page-item
									// $("<div class='page-item'></div>").appendTo()

								}								
							};
						});
					});
				});
			});
	});
});