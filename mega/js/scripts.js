var theme_classes = ['yellow', 'blue'];

var setTheme = function($element) {
    var random_number = Math.floor(Math.random()*theme_classes.length);
    
	$element.addClass(theme_classes[random_number]);	
}

var changeTheme = function($element) {
    var random_number = Math.floor(Math.random()*theme_classes.length);

    $(theme_classes).each(function(index) {
        $element.removeClass(theme_classes[index]);
    });

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

var updateTilesWord = function($clicked_element, theWord) {
	var $elements = $('.tile');
	var $clicked_element_index = $clicked_element.index();
    var length = $elements.length;
	var index = 0;
	var speed = 150;

    var single_timer = setInterval(replaceLetter("single"), speed);
	var timer = setInterval(replaceLetter, speed);

	function replaceLetter(mode="plural") {
      
        if (mode != "plural") { 
            index = $clicked_element_index; 
        } else if (mode == "plural" && index == 0 && $clicked_element_index == 0) {
            index = 1;    
        }

        var htmlContent = '';

        if (typeof theWord[index] !== 'undefined') {
            htmlContent = '<span class="dropshadow-'+theWord[index]+'">'+theWord[index]+'</span>';
        }

        pressTile($($elements.get(index))); 
        $($elements.get(index)).find('.letter').html(htmlContent);

		if (mode != "plural") { index = 0; 
        } else if ( mode == "plural" && index == ($clicked_element_index-1) ){
            index = index+2;
        } else { index++; }

        // remove timer after interating through all articles
        if (mode != "plural") {
            if (index >= length) {
                changeTheme($('.tiles-wrap'));
                clearInterval(timer);
            }
        } else {
            clearInterval(single_timer);
        }
	}
}

var goLive = function() {
	$('html').addClass('live');
}

var uiNext = function($element) {
	
	$('html').removeClass('live');

	if ($element.hasClass('tile')) {
	    var next_word = $element.data('nextWord');
        /**
        $element.find('.tile-click-overlay').addClass('selected').delay(150).queue(function(next) {
			$(this).removeClass('selected').dequeue();
			var next_word = $element.data('nextWord');
			if (typeof next_word !== 'undefined') {
				updateTilesWord(next_word);
			} else {
				goLive();
			}
		});
        **/
        if (typeof next_word !== 'undefined') {
            updateTilesWord($element, next_word);
        } else {
            pressTile($element);
            goLive();
        }
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
