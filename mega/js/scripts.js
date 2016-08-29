//Test explosion code
/**
var createPixels = function(numParticles, $tile) {
	var pixelColor = $tile.css('background-color');
	var pixelInnerColor = $tile.find('.tile-inner-wrap').css('background-color');
	
	var pixelR = "15px";

	for(var i = 0; i < numParticles; i++) {
		$tile.append(
			'<span class="pixel" style="background-color: '+pixelColor+'; width: '+pixelR+'; height: '+pixelR+';">'+
				'<span class="pixel-inner-wrap" style="background-color: '+pixelInnerColor+';"></span>'+
			'</span>');
	}
}

var explode = function($element) {
	var $tile = $element.closest('.tile');
	var tileOffset = $tile.offset();
	var tileCenterX = tileOffset.left + ($tile.outerWidth()/2);
	var tileCenterY = tileOffset.top + ($tile.outerHeight()/2);

	$tile.find('.pixel').each(function() {
		console.log($(this));
		$(this).attr("style", function() { return $(this).attr("style") + " left:"+($tile.outerWidth()/2)+"px;" });
		$(this).attr('style', function() { return $(this).attr("style") + " top:"+($tile.outerHeight()/2)+"px;" });
		console.log($(this).css('top'));
	});
	
	$element.addClass('exploding');
}
**/

var setTheme = function($element) {
	var theme_classes = ['yellow', 'blue'];
	var random_number = Math.floor(Math.random()*theme_classes.length);

	$element.addClass(theme_classes[random_number]);	
}

$( document ).ready(function() {

setTheme($('.tiles-wrap'));

// Test explosion code
/**
$('.tile').each(function() {
	createPixels(1, $(this));
});

$('.tile').click(function() {
	if (!$(this).hasClass('exploding') && !$(this).hasClass('exploded')) {
		explode($(this));
	}
});
**/

$('.tile').click(function() {
	$(this).find('.tile-click-overlay').addClass('selected').delay(150).queue(function(next) {
		$(this).removeClass('selected').dequeue();
	});
});

});
