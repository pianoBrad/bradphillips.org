(function ($) {
var footerHeight = 0;

var getFooterHeight = function() {
	footerHeight = $('.footer-wrap').outerHeight( true ) + 75;
}


$(window).resize(function() {
	getFooterHeight();	
});

$('.section-2').waypoint(function(direction) {
	if( direction == 'down' ) {
		$('.showcase iframe').css('width', '350px').css('height', '196.75px').css('float','left');
		$('.showcase-wrap').css('height','196.75px').css('bottom',footerHeight);
	} else {
		$('.showcase iframe').css('width', '700px').css('height','393.5px');
		$('.showcase-wrap').css('height','393.5px').css('bottom','auto');
	}
});


$(document).ready(function() {
	setTimeout ( function () {
	        getFooterHeight();
	    }, 50);
	
	$('body').parallax("50%", -2.25);
	$('.sun').parallax("50%", -4);
	$('.stars').parallax("50%", 2.5);
});
}(jQuery));