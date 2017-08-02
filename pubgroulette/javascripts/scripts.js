(function ($) {


  //var locations_list = ['Zharki', 'Gun Range', 'Severny', 'Stalber', 'Georgopol', 'Hospital', 'Ruins', 'Water Town', 'Rozhok', 'School', 'Yasnaya Polyana', 'Villa', 'Lipovka', 'Bunker', 'Pochinki', 'Gatka', 'Swamp Town', 'Primorski', 'West Bridge Coast', 'East Bridge Coast', 'Mylta', 'Sosnovka Military Base'];

  var locations_list = {
    options: [
      {name: "Zharki", description: "Start the round here."},
      {name: "Gun Range", description: "Start the round here."},
      {name: "Severny", description: "Start the round here."},
      {name: "Stalber", description: "Start the round here."},
      {name: "Georgopol", description: "Start the round here."},
      {name: "Hospital", description: "Start the round here."},
      {name: "Ruins", description: "Start the round here."},
      {name: "Water Town", description: "Start the round here."},
      {name: "Rozhok", description: "Start the round here."},
      {name: "School", description: "Start the round here."},
      {name: "Yasnaya Polyana", description: "Start the round here."},
      {name: "Villa", description: "Start the round here."},
      {name: "Lipovka", description: "Start the round here."},
      {name: "Bunker", description: "Start the round here."},
      {name: "Pochinki", description: "Start the round here."},
      {name: "Gatka", description: "Start the round here."},
      {name: "Swamp Town", description: "Start the round here."},
      {name: "Primorski", description: "Start the round here."},
      {name: "West Bridge Coastline", description: "Start the round here."},
      {name: "East Bridge Coastline", description: "Start the round here."},
      {name: "Mylta", description: "Start the round here."},
      {name: "Sosnovka Military Base", description: "Start the round here."},
      {name: "Mylta Power", description: "Start the round here."}
    ]
  }

  var kill_list = {
    options: [
      {name: "Friday the 13th", description: "Pick up a ballistics mask and a machete, and kill someone melee-style."},
      {name: "Roadkill", description: "Run someone down in a vehicle."},
      {name: "'Nade", description: "Get a kill via grenade or molotov cocktail."},
      {name: "Panned", description: "Get a melee kill via the Frying Pan."}
    ]
  };

  var weapon_list = {
    options: [
      {name: "Pistols Only", description: "Only pistols can be equipped."},
      {name: "Snipers Only", description: "Only snipers can be equipped."},
      {name: "No Scopes", description: "No scopes allowed on any weapon."},
      {name: "Grenades Only", description: "Only grenades can be equipped."}
    ]
  }

  var gear_list = {
    options: [
      {name: "Top Model", description: "Find an equip an entirely new wardrobe."},
      {name: "Waldo", description: "End the round in the red striped shirt."},
      {name: "No armor", description: "No armor can be equipped."}
    ]
  }

  var hungergames_list = {
    options: [
      {name: "Crates Only", description: "All loot comes from crates."},
      {name: "Pro Skater", description: "Complete a backflip in any vehicle."}
    ]
  }

  var game_conditions = [];

  $('.header-wrap .btn-primary').on('click', function(e) {
    e.preventDefault();
    /** Load up variables here & display on page**/
    game_conditions = [];
    $('.header-wrap .checkbox input:checked').each(function() {
      var label = $(this).parent().find('.label-value').html();
      if (label.length > 0) {
        switch(label) {
          case "Location":
            var location = locations_list.options[Math.floor(Math.random()*locations_list.options.length)];
            location.type = "location";
            game_conditions.push(location);
            break;
          case "Kill":
            var kill = kill_list.options[Math.floor(Math.random()*kill_list.options.length)];
            kill.type = "kill";
            game_conditions.push(kill);
            break;
          case "Weapon":
            var weapon = weapon_list.options[Math.floor(Math.random()*weapon_list.options.length)];
            weapon.type = "weapon";
            game_conditions.push(weapon); 
            break;
          case "Gear":
            var gear = gear_list.options[Math.floor(Math.random()*gear_list.options.length)];
            gear.type = "gear";
            game_conditions.push(gear);
            break;
          case "Hunger Games":
            var hungergames = hungergames_list.options[Math.floor(Math.random()*hungergames_list.options.length)];
            hungergames.type = "hungergames";
            game_conditions.push(hungergames);
            break;
          default:
            break;
        }
      }
    });

    if (game_conditions.length > 0) { 
      $('.game-rules').html(''); 
      var html = "<h3>Your Custom #PUBG Rules:</h3>";  
      $(game_conditions).each(function(index, value) {
        html += '<div class="game-rule' + value.type + '">';
        html += '<h4 class="rule-category">' + value.type + '</h4>';
        html += '<ul class="rule-content">';
        html += '<li class="rule-name"><h4>' + value.name + '</h4></li>';
        html += '<li class="rule-description">' + value.description + '</li>';
        html += '</ul>';
        html += '</div>';
      });
      $('.game-rules').append(html);
    }
  });


}(jQuery));
