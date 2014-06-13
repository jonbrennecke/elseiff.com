( function ( mod ) {
	define( mod )
})( function () {

	/**
	 *
	 * PackageList is passed a promise that resolves with a list of package schemas from the API
	 *
	 */
	function PackageList ( promise ) {

		// wait for the animation and the query to complete
		$('.page-item').promise().done( function () {
			promise.done( function ( data ) {

				var packages = data.message.packages,
					preloads = $(".preload-wrap");

				if ( packages ) {

					// loop through the longer of packages or preloads
					for ( var i = 0; i < Math.max( packages.length, preloads.length ); i++) {

						var pre = $( preloads.get(i) )

						if ( pre.length ) {

							// find the i-th preload element and fade it out
							pre.fadeOut(200)

							if ( i < packages.length ) {

								// display the package info
								var keywords = "<ul class='keywords'>";

								packages[i].keywords.forEach( function ( key ) {
									keywords += "<li>" + key + "</li>";
								});

								pre.parent()
									.append("<div class='loaded-wrap'>" + 
											"<a data-package='" + packages[i].name + "' class='heart fa fa-heart'></a>" +
											"<a class='name' href='/packages/" + packages[i].name + "'>" + packages[i].name + "</a>" +
											"<p class='author'>" + packages[i].author + "</p>" +
											"<p class='description'>" + packages[i].description + "</p>" +
											keywords + "</ul></div>" )

								pre.promise().done( function () {
									$(this).parent().find(".loaded-wrap").fadeIn(200)
								});

							}
							else {

								// there may be fewer packages than preloads
								// in which case, fadeOut the remaining preloads
								pre.parent().delay(100).fadeOut(500)
								
							}
						}
						else {

							// there are more packages than preloads, so
							// make another .page-item
							$("<div class='page-item filled'></div>").appendTo(".page").fadeIn()

						}
					}
				}

			});
							

							
				

				// 			// handle clicks to the heart
				// 			$(".heart").click( function () {
				// 				var pkg = $(this).attr('data-package');

				// 				$(this).toggleClass('fav',80)

				// 				$.ajax({
									
				// 					method : "POST",
				// 					url : "http://localhost:8081/api/user/favorites",
				// 					data : { pkg : pkg },
				// 					success : function ( data ) {
				// 						console.log( data )
				// 					},
				// 					failure : function ( err ) {
				// 						console.log( err )
				// 					}
				// 				})

				// 			});

				// 		}


		});

	}

	return PackageList

});	