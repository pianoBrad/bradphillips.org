var theme_classes = ['yellow', 'blue'];
var hammerInstances = [];
var numCols = 3;
var curPercentOffset = 0;
var globalThreshold = (100/2);


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

		$('.tiles').removeClass('animate');

		// Set up initial variables
		var $parent = $(this).closest('.tiles');
		var threshold = 50;
		var top = '0%';
		
		if (dir == "up" || dir == "down") {
			//startOffset = (tileOffsetStartY > 0) ? ($parent.outerHeight()/tileOffsetStartY) : 0;
		}
		if ((percent < 100 && percent > 0) || (percent > -(100) && percent < 0)) { 
			left = (percent)+'%';
		} else if (percent < -(100/numCols)) {
			left = '-100%';
		} else {
			left = '100%';
		}

		// Move them tiles!
		if (dir != "up" && dir != "down") {
			$(this).css({
				"-webkit-transform":"translate("+left+","+top+")",
				"-ms-transform":"translate("+left+","+top+")",
				"transform":"translate("+left+","+top+")"
			});
		}
		
	});
}

var animateTileSet = function(elements, percentage) {

	console.log('test');	

	percentage = percentage || '0%';

	$.each(elements, function() {
		$(this).css({
            "-webkit-transform":"translateX("+percentage+")",
            "-ms-transform":"translateX("+percentage+")",
            "transform":"translateX("+percentage+")",
			"z-index":"1"
		});
	});
}

getMatchingSiblings = function($element, $searchSet, dir) {
	var tiles = [];
	dir = dir || 'horizontal';

	$searchSet.each(function() {
		if (dir == 'horizontal') {
			if($(this).offset().top == $element.offset().top) {
				tiles.push($(this));
			}
		} else {
			if($(this).offset().left == $element.offset().left) {
                tiles.push($(this));
            }
		}
    });
	return tiles;
}

var tileHammerHandler = function(tileId, ev) {
	stopLive();	

	$tile = $('#'+tileId);	
	
	var tileW = $tile.outerWidth();
	var delta = dirProp(ev.direction, ev.deltaX, ev.deltaY);
    //var percent = ((100 / tileW) * delta) / numCols;
    var percent = ((100 / tileW) * delta);
	var animate = false;

	//console.log(percent);
	$allTiles = $tile.siblings();

	var tiles = [];
	tiles.push($tile);
	tiles = $.merge(tiles, getMatchingSiblings($tile, $allTiles));
	tiles = $.merge(tiles, getMatchingSiblings($tile, $('.tiles-wrap.nav.left .tile')));
	//console.log(ev.type);

	
	switch (ev.type) {
		case "panleft":
			moveTileSet(tiles, percent, 'left');
			curPercentOffset = percent;			
			break;
		case "panright":
			moveTileSet(tiles, percent, 'right');
			curPercentOffset = percent;
			break;
		case "panend":
			$('.tiles').addClass('animate');
			if (Math.abs(curPercentOffset) > globalThreshold) {
				if (curPercentOffset < 0) {
					animateTileSet(tiles, '-100%');
				} else {
					animateTileSet(tiles, '100%');
				}
			} else {
				animateTileSet(tiles, '0%');
			}
			break; 
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
			
			} 	
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
