/**
*
* general UI/UX animations
*
*/

define(function () {

	$(".title").fadeIn(200)

	$( ".sidebar-item" ).show().each( function ( i ) {
		$(this).delay( 50 * i ).addClass( "filled", 700, "easeOutQuint" )
	})

	$( ".header-item" ).show().each( function ( i ) {
		$(this).delay( 50 * i).addClass( "filled", 700, "easeOutBack" )
	})

	// hide any empty values in the table and fade in 
	$(".text-wrap")
		.fadeIn()
		.find("span.value:empty")
		.parent()
		.hide()

	return $( ".page-item" ).show().each( function ( i ) {
		$(this).delay( 150 * i ).addClass( "filled", 700, "easeOutQuint" )
	}).promise()

});


