var theme_classes = ['yellow', 'blue'];
var hammerInstances = [];
var numCols = 3;
var curPercentOffset = 0;
var globalThreshold = (100/2);

function typeIt($selector, phrases) {
	$selector.typed({
		strings: phrases,
        contentType: 'html', //to do html, set to 'text' if only strings
		typeSpeed: 0
    });
}

var setTheme = function($element) {
    var random_number = Math.floor(Math.random()*theme_classes.length);
    var new_theme = theme_classes[random_number];

	$('body').addClass(new_theme);
	$element.addClass(new_theme);
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

function goLive() {
	$('html').removeClass('ui-updating ui-sliding ui-tiles ui-text-detail').addClass('live');
}
function stopLive(type) {
	type = type || 'none';	

	$('html').removeClass('live').addClass('ui-updating');
	if (type != 'none') {
		$('html').addClass(type);
	}
}
function isLive() {
	if ($('html').hasClass('live')) {
		return 'true';
	} else {
		return 'false';
	}
}
function isUpdating(theClass) {
	theClass = theClass || 'ui-updating'

	if ($('html').hasClass(theClass)) {
        return 'true';
    } else {
        return 'false';
    }
}

function showTextDetail(detail_id) {
	//Currently demo purposes
	//To-Do: Incorporate detail_id with eventual JSON doc to construct content for text detail overlay
	var $detail_overlay = $('.text-detail').first();
	var $megalodon = $detail_overlay.find('.megalodon').first();

	stopLive('ui-text-detail');

	$detail_overlay.addClass('showing');
	$megalodon.addClass('showing');

	setTimeout(function() {
		$detail_overlay.removeClass('showing').addClass('shown');
		$megalodon.removeClass('showing').addClass('shown');
	}, 1250);
}
function hideTextDetail() {
	var $detail_overlay = $('.text-detail').first();
	var $megalodon = $detail_overlay.find('.megalodon').first();

	$detail_overlay.removeClass('shown showing').addClass('hiding');
	$megalodon.removeClass('shown showing').addClass('hiding');

	setTimeout(function() {
		$detail_overlay.removeClass('hiding');
		$megalodon.removeClass('hiding');
		goLive();
	}, 1000)
}

var uiNext = function($element) {
	
	if ($element.hasClass('tile')) {
		stopLive('ui-tiles');	    

		var next_word = $element.data('nextWord');
        var text_detail = $element.data('textDetail');

		if (typeof next_word !== 'undefined') {
            updateTilesWord($element, next_word);
        } else if (typeof text_detail !== 'undefined') {
			showTextDetail(text_detail);
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
				"-webkit-transform":"translateX("+left+")",
				"-ms-transform":"translateX("+left+")",
				"transform":"translateX("+left+")"
			});
		}
		
	});
}

var animateTileSet = function(elements, percentage) {

	percentage = percentage || '0%';

	$.each(elements, function() {
		$(this).css({
            "-webkit-transform":"translateX("+percentage+")",
            "-ms-transform":"translateX("+percentage+")",
            "transform":"translateX("+percentage+")",
			"z-index":"1"
		});
	});
	setTimeout(goLive(), 300);
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
	console.log(isUpdating());
	if (isUpdating('ui-tiles') == 'false') {	

	stopLive('ui-sliding');	

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
			console.log('hammer fired!');
			if(ev.type == "panend" || ev.type == "panstart") {

				tileOffsetStartX = $(ev.target).closest('.tiles').find('.tile').first().css('left').replace('px','');
				tileOffsetStartY = $(ev.target).closest('.tiles').find('.tile').first().css('top').replace('px','');
			
			} 	
			tileHammerHandler(tileId, ev);
		});
		hammerInstances.push(mc);
	});

	goLive();
}

function addWaves() {
	var winW = $(window).outerWidth();
	var waveW = $('.wave-container .wave-top').first().outerWidth();	
	var numWaveTops = Math.ceil(winW/waveW);

	$('.wave-container').each(function() {
		$(this).find('.wave-top').remove();
		var $i = 0;
		while ($i < numWaveTops) {
			$(this).prepend('<span class="wave-top"></span>');
			$i++;	
		} 
	});
}

function addEventListeners() {
	$(window).resize(function() {
		addWaves();
	});

	$(document).on('click', '.live .tile, .ui-text-detail .text-detail', function(e) {
		var $element = $(e.target);

		if ($element.closest('.tile').length > 0) {
			uiNext($(this));
		} else if ($element.closest('.text-detail').length > 0 && $element.closest('.megalodon').length < 1) {
			if ($element.closest('.showing').length < 1) {
				hideTextDetail();	
			}
		} else {
		}
	
	});

	setUpHammerListeners($('.ui .tiles-wrap:not(.nav) .tile'));
}

$( document ).ready(function() {

setTheme($('.tiles-wrap'));

addWaves();

addEventListeners();

typeIt($('#hud-message'), ["hello!"]);

});
