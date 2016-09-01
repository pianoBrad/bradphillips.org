var theme_classes = ['yellow', 'blue'];
var hammerInstances = [];
var numCols = 3;

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

	function replaceLetter(mode) {
     
        mode = mode || "plural";
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
        if (mode == "plural") {
            if (index >= length) {
                clearInterval(timer);
                goLive();
            }
        } else {
            clearInterval(single_timer);
        }
	}

    changeTheme($('.tiles-wrap'));
}

var goLive = function() {
	$('html').removeClass('ui-updating').addClass('live');
}
var stopLive = function() {
	$('html').removeClass('live').addClass('ui-updating');
}

var uiNext = function($element) {
	
	stopLive();	

	if ($element.hasClass('tile')) {
	    var next_word = $element.data('nextWord');
        if (typeof next_word !== 'undefined') {
            updateTilesWord($element, next_word);
        } else {
            pressTile($element);
            goLive();
        }
	}

}

function dirProp(direction, hProp, vProp) {
    return (direction & Hammer.DIRECTION_HORIZONTAL) ? hProp : vProp
}

var moveTileSet = function(elements, percent, dir) {
	//console.log(percent);
	$.each(elements, function() {
		if (percent < (100/numCols) && percent > -(100/numCols)) { 
			$(this).css({
				'left' : percent+'%'
			});
		} else if (percent < -(100/numCols) && percent < 0) {
			$(this).css({
                'left' : '-'+percent+'%'
            });
		} else if (percent < -(100/numCols)) {
			$(this).css({
                'left' : '-33.333%'
            });
		} else {
			$(this).css({
				'left' : '33.333%'
			});
		}
	});
}

getMatchingSiblings = function($element, $searchSet) {
	var tiles = [];
	$searchSet.each(function() {
        if($(this).offset().top == $element.offset().top) {
            tiles.push($(this));
		}
    });
	return tiles;
}

var tileHammerHandler = function(tileId, ev) {
	stopLive();	

	$tile = $('#'+tileId);	
	
	var tileW = $tile.outerWidth();
	var delta = dirProp(ev.direction, ev.deltaX, ev.deltaY);
    var percent = ((100 / tileW) * delta) / numCols;
    var animate = false;

	//console.log(percent);
	$allTiles = $tile.siblings();

	var tiles = [];
	tiles.push($tile);
	//console.log(ev.type);
	
	switch (ev.type) {
		case "panleft":
			tiles = $.merge(tiles, getMatchingSiblings($tile, $allTiles));
			tiles = $.merge(tiles, getMatchingSiblings($tile, $('.tiles-wrap.nav.left .tile')));
			moveTileSet(tiles, percent);
			break;
		case "panright":
			tiles = $.merge(tiles,getMatchingSiblings($tile, $allTiles));
			tiles = $.merge(tiles, getMatchingSiblings($tile, $('.tiles-wrap.nav.left .tile')));
			moveTileSet(tiles, percent);
		default:
			break;
	}
}


var setUpHammerListeners = function($selector) {

	$selector.each(function() {
		var tileId = $(this).attr('id');

		var myElement = document.getElementById(tileId);

		// create a simple instance
		// by default, it only adds horizontal recognizers
		var mc = new Hammer(myElement);

		// let the pan gesture support all directions.
		// this will block the vertical scrolling on a touch-device while on the element
		mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

		// listen to events...
		mc.on("panleft panright panup pandown", function(ev) {
			//myElement.textContent = ev.type +" gesture detected.";
			tileHammerHandler(tileId, ev);
		});
		hammerInstances.push(mc);
	});

}


$( document ).ready(function() {

setTheme($('.tiles-wrap'));


$('.live .tile').on('click', function() {
	if ($('.live').length > 0) {
		uiNext($(this));
	}
});

setUpHammerListeners($('.ui .tiles-wrap:not(.nav) .tile'));

});
