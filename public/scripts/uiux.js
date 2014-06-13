/**
*
* general UI/UX animations
*
*/

( function ( mod ) {
	define( mod )
})( function () {

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


