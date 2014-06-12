


// hide any empty values in the table and fade in 
$(".text-wrap")
	.fadeIn()
	.find("span.value:empty")
	.parent()
	.hide()
