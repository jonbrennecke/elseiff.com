(function ( mod ) {
	define( mod )
})( function () {
	
	var d = $.Deferred();

	// loading animation
	$( document ).ready( function () {

		$(".wireframe")
			.addClass("filled", 500, "easeOutBack" )
			.promise()
			.done( function () {
				d.resolve();
			});
	});

	return d;

})