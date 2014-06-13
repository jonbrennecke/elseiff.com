( function ( mod ) {
	define( mod )
})( function () {
	return function ( query ) {

		$(".preload-wrap")
		.fadeIn(200)
		.promise()
		.done( function () {
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
										"<a data-package='" + pkgs.message[i].name + "' class='heart fa fa-heart'></a>" +
										"<a class='name' href='/packages/" + pkgs.message[i].name + "'>" + pkgs.message[i].name + "</a>" +
										"<p class='author'>" + pkgs.message[i].author + "</p>" +
										"<p class='description'>" + pkgs.message[i].description + "</p>" +
										keywords + "</ul></div>" )

							// handle clicks to the heart
							$(".heart").click( function () {
								var pkg = $(this).attr('data-package');

								$(this).toggleClass('fav',80)

								$.ajax({
									
									method : "POST",
									url : "http://localhost:8081/api/user/favorites",
									data : { pkg : pkg },
									success : function ( data ) {
										console.log( data )
									},
									failure : function ( err ) {
										console.log( err )
									}
								})

							});

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
	}
});