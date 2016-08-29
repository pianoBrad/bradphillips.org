var setTheme = function($element) {
	var theme_classes = ['yellow', 'blue'];
	var random_number = Math.floor(Math.random()*theme_classes.length);

	$element.addClass(theme_classes[random_number]);	
}

var clickOrTouch = function() {
	if (Modernizr.touch) {
		return "touchstart";
	} else {
		return "click";
	} 
}

var pressTile = function($element) {
    $element.find('.tile-click-overlay').addClass('selected').delay(150).queue(function(next) {
        $(this).removeClass('selected').dequeue();
    });
}

var updateTilesWord = function(theWord) {
	var $elements = $('.tile');
	var length = $elements.length;
	var index = 0;
	var speed = 150;
	
	var timer = setInterval(replaceWord, speed);

	function replaceWord() {

		var htmlContent = '';

        if (typeof theWord[index] !== 'undefined') {
            console.log('yah!');
            htmlContent = '<span class="dropshadow-'+theWord[index]+'">'+theWord[index]+'</span>';
        }

        pressTile($($elements.get(index))); 
        $($elements.get(index)).find('.letter').html(htmlContent);

		index++;

        // remove timer after interating through all articles
        if (index >= length) {
            clearInterval(timer);
        }
	}
}

var goLive = function() {
	$('html').addClass('live');
}

var uiNext = function($element) {
	
	$('html').removeClass('live');

	if ($element.hasClass('tile')) {
		$element.find('.tile-click-overlay').addClass('selected').delay(150).queue(function(next) {
			$(this).removeClass('selected').dequeue();
			var next_word = $element.data('nextWord');
			if (typeof next_word !== 'undefined') {
				updateTilesWord(next_word);
			} else {
				goLive();
			}
		});
	}

}

$( document ).ready(function() {

setTheme($('.tiles-wrap'));


$('.tile').on(clickOrTouch(), function() {
	if ($('.live').length > 0) {
		uiNext($(this));
	}
});

});
