/**
*
* general UI/UX animations
*
*/

( function ( mod ) {
	define( mod )
})( function () {

	// function to link to the heart on package items
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

	$(".title").fadeIn(200)

	// hide any empty values in the table and fade in 
	$(".text-wrap")
		.fadeIn()
		.find("span.value:empty")
		.parent()
		.hide()

	var sidebarItems = $( ".sidebar-item" ).show().each( function ( i ) {
		$(this).delay( 50 * i ).addClass( "filled", 700, "easeOutQuint" )
	});
	
	var headerItems = $( ".header-item" ).show().each( function ( i ) {
		$(this).delay( 50 * i).addClass( "filled", 700, "easeOutBack" )
	});

	var pageItems = $( ".page-item" ).show().each( function ( i ) {
		$(this).delay( 150 * i ).addClass( "filled", 700, "easeOutQuint" )
	});

	// we'll return some promises from these animations
	return {
		pageItems : pageItems.promise(),
		sidebarItems : sidebarItems.promise(),
		headerItems : headerItems.promise()
	}
});


