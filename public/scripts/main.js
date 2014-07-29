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
 * this is the main script for the front-end pages
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Wireframes
// ----
// The wireframe animations make the page seem more responsive, so they are loaded first
// while the rest of the page content is asynchronously loaded
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var d = $.Deferred();

$(document.body).ready(function() {

	// if we're coming from the same page, we've already seen it once, so don't show off as much
	if ( document.referrer.indexOf(location.protocol + "//" + location.host) === 0 ) {
		$(".wireframe")
			.addClass("filled")
			.promise()
			.done( function () {
				d.resolve();
			});
	}
	else {
		$(".wireframe")
			.addClass("filled", 500, "easeOutBack" )
			.promise()
			.done( function () {
				d.resolve();
			});
	}
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// load the ui/ux script
// ----
// the return value is a function 'startAnims' that starts the UI animations 
// and returns a JSON object containing promises which resolve once the animations have finished
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
require([ 'uiux' ], function ( startAnims ) {

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// once the wireframe animation has finished, run the UI animations to finish creating 
	// the page
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	$.when( d ).done( function () {

		var uiPromises = startAnims();

		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		// for certain pages, the requirejs <script> tag in <head> may have a data-second attribute
		// specifying a secondary script to be loaded
		// 
		// the secondary script returns a function 'doPageAction' which takes as a parameter the
		// promises returned from the UI animations
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		var rjsData = document.getElementById('requirejs').dataset;

		if ( rjsData.second ) {
			require([ rjsData.second ], function ( doPageAction ) {
				doPageAction( uiPromises );
			});
		}

	});
});

