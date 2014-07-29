/**
*
* general UI/UX animations
*
*/

( function ( mod ) {
	define( mod )
})( function () {

	// // function to link to the heart on package items
	// window.heart = function () {
	// 	var pkg = $(this).attr('data-package');

	// 	$(this).toggleClass('fav', 80 )

	// 	$.ajax({
			
	// 		method : "POST",
	// 		url : "http://" + host + "/api/user/favorites",
	// 		data : { pkg : pkg },
	// 		success : function ( data ) {
	// 			console.log( data )
	// 		},
	// 		failure : function ( err ) {
	// 			console.log( err )
	// 		}
	// 	});
	// };

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// we'll return a function that generates the wireframe animations
	// and returns some promises that resolve when the animations have finished
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return function wireframe () {

		$(".title").fadeIn(200)

		// hide any empty values in the table and fade in 
		$(".text-wrap")
			.fadeIn()
			.find("span.value:empty")
			.parent()
			.hide()

		return {
			sidebar : $( ".sidebar-item" ).show().each( function ( i ) {
				$(this).delay( 50 * i ).addClass( "filled", 700, "easeOutQuint" )
			}).promise(),
		
			header : $( ".header-item" ).show().each( function ( i ) {
				$(this).delay( 50 * i).addClass( "filled", 700, "easeOutBack" )
			}).promise(),

			page : $( ".page-item" ).show().each( function ( i ) {
				$(this).delay( 150 * i ).addClass( "filled", 700, "easeOutQuint" )
			}).promise()
		}
	}
});


