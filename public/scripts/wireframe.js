(function ( mod ) {
	define( mod )
})( function () {
	
	var d = $.Deferred();

	// if we're coming from the same page, don't show off
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

	return d;

})