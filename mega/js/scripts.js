var theme_classes = ['yellow', 'blue'];
var hammerInstances = [];
var numCols = 3;
var curPercentOffset = 0;
var globalThreshold = (100/2);

/** Match Game Variables **/
var match_colors = [];
var total_matches = 0;
var cur_flipped = '';

var curMenu = 'home';

function typeIt($selector, phrases) {
	var $parent = $($selector.parent());
	$selector.remove();
	$parent.prepend($selector);
	$selector.typed({
		strings: phrases,
        contentType: 'html', //to do html, set to 'text' if only strings
		typeSpeed: 0,
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
		return "touchend";
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

    var $elements = $clicked_element.closest('.ui').find('.tile');
	var $clicked_element_index = $clicked_element.index();
    var length = $elements.length;
	var index = 0;
	var speed = 125;

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
	$('html').removeClass('ui-updating ui-sliding ui-tiles ui-moving-forward ui-moving-back ui-text-detail').addClass('live');
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

function changeNextWord($selector, word) {
	$selector.attr('data-next-word',word);
}
function changeTextDetail($selector, word) {
	$selector.attr('data-text-detail', word);
}

function updateCurMenu(next_word) {
	if (curMenu != next_word) {
		curMenu = next_word;
	}
	// linkage stuff for demo purposes
	if (curMenu.indexOf("GAMERS") >= 0) {
		//We're on gamers tiles, let's set up back/forward buttons
		for (var i = 0, len = next_word.length; i < len; i++) {
			if (next_word[i] == 'r') {
				var $tile = $($('.ui-menu .tile').get(i));
				$tile.attr('data-next-word', '');
				$tile.attr('data-text-detail', '');	
				$tile.attr('data-ui-move-forward','#ui-match');
			}
		}
	} else if (curMenu.indexOf("OUT") >= 0) {
		//We're on about us tiles, let's set up back/forward buttons
		for (var i = 0, len = next_word.length; i < len; i++) {
			if (next_word[i] == 'r') {
				var $tile = $($('.ui-menu .tile').get(i));
				$tile.attr('data-next-word', '');
                $tile.attr('data-text-detail', '');
                $tile.attr('data-ui-move-forward','#ui-team');
			}
		}
	} 
}

function resetTiles($ui, timeOut) {
	timeOut = timeOut || 500;
	$ui.find('.tiles-wrap .tile').each(function() {
		$(this).attr('style','');
	});
	
	setTimeout(goLive, timeOut);
}

/** Match Game Functions **/	
function startMatchGame() {
	match_colors = ['red','red','orange','orange','yellow','yellow','blue','blue'];
	cur_flipped = '';
	total_matches = 0;

	//Add colors to tiles
	$('#ui-match .tiles-wrap').first().find('.tile:not(.center)').each(function() {
		$(this).attr('data-match-color','');
	});
}
function checkForMatch($tile_1, $tile_2) {
	var tile_1_color = $tile_1.attr('data-match-color');
	var tile_2_color = $tile_2.attr('data-match-color');
	
	if (tile_1_color == tile_2_color) {
		return 'true';
	} else {
		return 'false';
	}
}
function flipTile($tile, color, game_status) {
	game_status = game_status || '';
	setTimeout(
        function() {
            $tile.addClass('flipped').addClass(color);
			if (game_status == '') {
				goLive();
			} else if (game_status == 'win') {
				console.log('win!');
				typeIt($('#hud-message'), ["winner, chicken dinner!"]);
			} else {
				hideFlippedTiles([cur_flipped, $tile]);
			}
        },
    150);
}
function hideFlippedTiles(tiles) {
	setTimeout(
		function() {
			cur_flipped = '';
			$(tiles).each(function() {
				$(this).removeClass('flipped');
				$(this).removeClass('red orange yellow blue');
			});
			goLive();
		},
	500);
}
function revealMatchTile($tile) {
	var color = $tile.attr('data-match-color');
	if ($tile.attr('data-match-color').length < 1) {
		color = match_colors[Math.floor(Math.random()*match_colors.length)];
		$tile.attr('data-match-color', color);
		match_colors.splice( $.inArray(color, match_colors), 1 );
	}

	if (!$tile.hasClass('flipped'))	{
		if (cur_flipped.length < 1) {
			cur_flipped = $tile;
			pressTile($tile);	

			flipTile($tile, color);
		} else {
			var match = checkForMatch(cur_flipped, $tile);
			if (match == 'true') {
				if (total_matches < 3) {
					total_matches++;	
					cur_flipped = '';	
					flipTile($tile, color);
				} else {
					flipTile($tile, color, 'win');
				}	
			} else {
				flipTile($tile, color, 'hide')
			}
		}
	} else {
		goLive();
	}
}
/** Match Game Functions End **/

function moveUI(ui_id, direction) {
	direction = direction || 'forward'
	var bodyClass = 'ui-moving-'+direction;

	stopLive(bodyClass);

    var $mainMenu = $('.ui-menu');
    var $selectedMenu = $(ui_id);
	var $bodyWrap = $('.body-wrap');

	$('.ui').removeClass('moving');

	switch(direction) {
		case 'back': 
			$mainMenu.removeClass('inactive');
			$bodyWrap.removeClass('inactive');
			$selectedMenu.removeClass('active').addClass("moving");
			resetTiles($mainMenu);
			break;
		default:
			$mainMenu.addClass('inactive');
			$bodyWrap.addClass('inactive');
			$selectedMenu.addClass('active moving');
			if ($selectedMenu.attr('id') == 'ui-match') {
				startMatchGame();
			}
			resetTiles($selectedMenu);
			break;
	}	

}

function resetUI(ui_id, word) {
	var $uiMenu = $(ui_id);

	stopLive('ui-resetting');

	$uiMenu.find('.tiles li').each(function() {
		$(this).attr('style','');
	});

	if ( curMenu != word ) {
		updateTilesWord($uiMenu.find('li').first(), word);
		updateCurMenu(word);
	} else {
		goLive();
	}
		
}

var uiNext = function($element) {
	
	if ($element.hasClass('tile')) {
		stopLive('ui-tiles');	    

		var next_word = $element.data('nextWord');
        var text_detail = $element.data('textDetail');
		var ui_move_forward = $element.data('uiMoveForward');
		var ui_move_back = $element.data('uiMoveBack');
		var match_color = $element.data('matchColor');
		var ui_reset = $element.data('uiReset');
		var ui_target = $element.data('uiTarget');

		if (typeof next_word !== 'undefined' && next_word.length > 0 && curMenu != next_word) {
            updateTilesWord($element, next_word);
			updateCurMenu(next_word);
        } else if (typeof text_detail !== 'undefined' && text_detail.length > 0) {
			showTextDetail(text_detail);
		} else if (typeof ui_move_forward !== 'undefined' && ui_move_forward.length > 0) {
			moveUI(ui_move_forward);	
		} else if (typeof ui_move_back !== 'undefined' && ui_move_back.length > 0) {
			moveUI(ui_move_back, 'back');
		} else if (typeof ui_reset !== 'undefined' && ui_reset.length > 0 && ui_target.length > 0) {
			resetUI(ui_target, ui_reset);
		} else if (typeof match_color !== 'undefined') {
			revealMatchTile($element);
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
	if (isUpdating('ui-tiles') == 'false') {	

	stopLive('ui-sliding');	

	$tile = $('#'+tileId);	

	var tileW = $tile.outerWidth();
	var delta = dirProp(ev.direction, ev.deltaX, ev.deltaY);
    //var percent = ((100 / tileW) * delta) / numCols;
    var percent = ((100 / tileW) * delta) + tileOffsetStartX;
	var animate = false;

	//console.log(percent);
	$allTiles = $tile.siblings();

	var tiles = [];
	tiles.push($tile);
	tiles = $.merge(tiles, getMatchingSiblings($tile, $allTiles));
	tiles = $.merge(tiles, getMatchingSiblings($tile, $tile.closest('.ui').find('.tiles-wrap.nav.left .tile')));
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
		mc.on("tap panstart panleft panright panup pandown panend pancancel", function(ev) {
			//myElement.textContent = ev.type +" gesture detected.";
			var $element = $(ev.target);
			var is_nav = ($element.closest('.nav').length > 0) ? true : false;

            if(ev.type == "panstart") {
                var curTranslateX = $(ev.target).closest('.tile').css('transform').split(',')[4];
                tileOffsetStartX = 0;

                if (curTranslateX > 0) {
                    tileOffsetStartX = 100;   
                } else if (curTranslateX < 0) {
                    tileOffsetStartX = -100;    
                }
			
			} else if (ev.type == "tap") {
				var $element = $(ev.target);

				if ($element.closest('.tile').length > 0 && $element.closest('.live').length > 0) {
					uiNext($element.closest('.tile'));
				} else if ($element.closest('.text-detail').length > 0 && $element.closest('.megalodon').length < 1 && $element.closest('.ui-text-detail').length > 0) {
					if ($element.closest('.showing').length < 1 && $element.closest('.wave-container').length < 1) {
						hideTextDetail();
					}
				}
			}
            // Handle the action
			if (!is_nav) {
                tileHammerHandler(tileId, ev);
            }
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

	//Kill double-tap zoom on iOS devices
	if (Modernizr.touch) {
		var doubleTouchStartTimestamp = 0;
		document.addEventListener("touchstart", function (event) {
			var now = +(new Date());
			if (doubleTouchStartTimestamp + 500 > now) {
				event.preventDefault();
			}
			doubleTouchStartTimestamp = now;
		});
	}

    /**
	$('html').on('tap', '.tile, .text-detail', function(e) {
		var $element = $(e.target);

		if ($element.closest('.tile').length > 0 && $element.closest('.live').length > 0) {
			uiNext($(this));
		} else if ($element.closest('.text-detail').length > 0 && $element.closest('.megalodon').length < 1 && $element.closest('.ui-text-detail').length > 0) {
            if ($element.closest('.showing').length < 1 && $element.closest('.wave-container').length < 1) {
                hideTextDetail();
            }
        } 
	
	});
    **/

	setUpHammerListeners($('.ui .tiles-wrap .tile'));

}

$( document ).ready(function() {

setTheme($('.tiles-wrap'));

addWaves();

addEventListeners();

setTimeout(function() {
	typeIt($('#hud-message'), ["hello!"]);
	}, 1500);

});
