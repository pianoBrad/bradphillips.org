var theme_classes = ['yellow', 'blue'];
var hammerInstances = [];
var numCols = 3;
var tileOffsetStartX = 0;
var tileOffsetStartY = 0;

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

var percentToPix = function(percent, $parent, dir) {
	var containerW = $parent.outerWidth();
	var containerH = $parent.outerHeight();
	percent = percent/100;
	pixels = 0;

	switch (dir) {
		case "left":
		case "right":
			pixels = (containerW * percent);
			break;
		default: 
			pixels = (containerH * percent);
			break;
	}

	return pixels;
}

var moveTileSet = function(elements, percent, dir) {
	$.each(elements, function() {

		// Set up initial variables
		var $parent = $(this).closest('.tiles');
		var left = '0%';
		var threshold = (100/numCols);
		var startOffset = (tileOffsetStartX > 0) ? ($parent.outerWidth()/tileOffsetStartX) : 0;
		var totalOffset = threshold - startOffset;	
	
	
		if (dir == "up" || dir == "down") {
			threshold = $parent.outerHeight() * ((100/numCols)/100);
			startOffset = (tileOffsetStartY > 0) ? ($parent.outerHeight()/tileOffsetStartY) : 0;
		}
		if ((percent < totalOffset && percent > 0) || (percent > -(totalOffset) && percent < 0)) { 
			left = (startOffset + percent)+'%';
		} else if (percent < -(100/numCols)) {
			left = '-'+threshold+'%';
		} else {
			left = threshold+'%';
		}
	
		// Move them tiles!
		if (dir != "up" && dir != "down") {
			$(this).css({
				'left' : left
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
			moveTileSet(tiles, percent, 'left');
			break;
		case "panright":
			tiles = $.merge(tiles, getMatchingSiblings($tile, $allTiles));
			tiles = $.merge(tiles, getMatchingSiblings($tile, $('.tiles-wrap.nav.left .tile')));
			moveTileSet(tiles, percent, 'right');
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
		mc.on("panstart panleft panright panup pandown panend pancancel", function(ev) {
			//myElement.textContent = ev.type +" gesture detected.";
			if(ev.type == "panend" || ev.type == "panstart") {

				tileOffsetStartX = $(ev.target).closest('.tiles').find('.tile').first().css('left').replace('px','');
				tileOffsetStartY = $(ev.target).closest('.tiles').find('.tile').first().css('top').replace('px','');
			
				console.log(tileOffsetStartX);
			} else {	
				tileHammerHandler(tileId, ev);
			}
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
