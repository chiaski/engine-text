/*


    PLAYER PREVIEW
    
    
*/

console.log("playerpreview.js loaded");

$("#tempplay").click(function () {
  $('html, body').animate({
    scrollTop: $("#window-map").offset().top
  }, 200);
});

$("#tempremix").click(function () {
  $('html, body').animate({
    scrollTop: $("#window-load").offset().top
  }, 200);
  
  
  $("#btn-remixcartridge").hide();
  $("#load textarea#_remix").fadeIn();
  $("#btn-changestartingscene").hide();
  $("#btn-cartridge").hide();

  $("#load .controls-remixcartridge").fadeIn();
  
});


// arrow key navigation

var arrow_keys_handler = function (e) {
  switch (e.code) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
    case "Space":
      e.preventDefault();
      break;
    default:
      break; // do not block other keys
  }
};



// LOAD CARTRIDGE

const Tplayer = {

  active: scenes.s[0],
  cartridgeLoaded: false,
  /* 
    clearGame
    deletes and clears the game
  */

  clearGame: function () {

    // clear all visual styles
    $("#e-controls a").each(function (i, e) {
      $(this)
        .removeClass("-inaccessible")
        .addClass("-inaccessible")
        .attr("data-target", "null")
        .unbind("click", Tplayer.loadTarget);
    });

    Tplayer.clearScene();
    
    $("*[cartridge-title]").html(scenes.title);
  },
  playSong: function (song) {

    // load the song into the player

    let s = null;

    if (song) {
      s = song;
    } else {
      s = "https://engine.lol/alpha/assets/audio/" + scenes.audio;
    }

    $("#_audio")[0].currentTime = 0;


    $("._audiotitle").text(s);
    $("#_audio").attr("src", s);
    $("#_audio")[0].play();

  },
  loadTarget: function () {

    let target = $(this).attr("data-target");
    let x = target.split(',')[0];
    let y = target.split(',')[1];

    if (x == null || y == null) {
      return;
    }

    // success
    Tplayer.loadScene(x, y);

    Tplayer.animatePulse(); // little animation

  },

  animatePulse: function () {

    let $w = $("#play"); // set to play window
    $w.css("transform", "scale(1.03)");

    setTimeout(function () {
      $w.css("transform", "scale(0.99)");
    }, 500);
  },

  // iterates through navigation options on the active scene and updates it accordingly based on what's possible
  updateSceneNavigation() {
    // clear keydown queries
    $("#play").off("keydown");

    // clear all visual styles
    $("#e-controls a").each(function (i, e) {
      $(this)
        .removeClass("-inaccessible")
        .attr("data-target", "null")
        .unbind("click", Tplayer.loadTarget);

      var direction = $(this).data("direction");

      var convert = Tplayer.convertCoord(direction, Tplayer.active.x, Tplayer.active.y);

      // first, check if you can navigate to that scene
      if (convert == null) {
        $(this).addClass("-inaccessible");
        return;
      } else {

        var target = (convert.toString()).split(',');

        // next, check if a scene exists there
        if (sceneControls.getScene(target[0], target[1]) == null) {
          $(this).addClass("-inaccessible");
          return;
        }

        // okay, scene is accessible
        $(this)
          .attr("data-target", target[0] + "," + target[1])
          .bind("click", Tplayer.loadTarget);
      }

      // add keybinding
      $("#play").on('keydown', function (event) {
        if ((event.keyCode == 38 && direction == "n") || (event.keyCode == 87 && direction == "n") || (event.keyCode == 39 && direction == "e") || (event.keyCode == 68 && direction == "e") || (event.keyCode == 37 && direction == "w") || (event.keyCode == 65 && direction == "w") || (event.keyCode == 40 && direction == "s") || (event.keyCode == 83 && direction == "s")) {
          Tplayer.loadScene(parseInt(target[0]), parseInt(target[1]));
        }

      });

    });

  },

  // give direction and origin x,y
  // returns coordinates of new x, y in direction

  convertCoord: function (direction, x, y) {

    let new_x, new_y;

    var scene_count = Math.sqrt((scenes.s).length);

    switch (direction) {

      case "n":
        if (x > 0) {
          new_x = x - 1;
        } else {
          new_x = null;
        }
        new_y = y;
        break;

      case "e":

        if (y < scene_count - 1) {
          new_y = y + 1;
        } else {
          new_y = null;
        }

        new_x = x;
        break;

      case "w":
        if (y > 0) {
          new_y = y - 1;
        } else {
          new_y = null;
        }
        new_x = x;
        break;

      case "s":

        if (x < scene_count - 1) {
          new_x = x + 1;
        } else {
          new_x = null;
        }

        new_y = y;
        break;
    }

    // returns null if unconvertable
    if (new_x == null || new_y == null) {
      return null;
    }

    return [new_x + "," + new_y];
  },

  // loads scene (x,y)
  loadScene: function (x, y) {

    // first, clear scene
    Tplayer.clearScene();

    Tplayer.active = sceneControls.getScene(x, y);

    // add text
    $("#e-play textarea").hide().delay(300).fadeIn("slow").val((Tplayer.active.textoverlay).replace(/\\n/g, "\n").replace(/&nbsp;/g, " "));

    // add effect
    if (Tplayer.active.effect) $("#e-play #e-effects").attr("style", Tplayer.active.effects);

    // add caption
    if (Tplayer.active.caption) $("#e-controls").attr("title", Tplayer.active.caption);

    // add title
      if (!Tplayer.active.title) {
      $("._title").text("Scene");
    } else if (Tplayer.active.title || Tplayer.active.title !== undefined || Tplayer.active.title !== "Scene") {
      $("._title").text(Tplayer.active.title);
    } else {
      $("._title").text("Scene");
    }

    // update text
    $("._playwhatscene").text((Tplayer.active).x + "," + (Tplayer.active).y);

    // update the scene color
    Tplayer.loadColor();

    // update the scene navigation
    Tplayer.updateSceneNavigation();

  },
  
  loadCover: function(){
     // cartridge checks
        Tplayer.loadCartridge();
//    
//    if (scenes.cartridge !== null) {
//      // load the cartridge if necessary
//      if(!Tplayer.cartridgeLoaded){
//        Tplayer.loadCartridge();
//        Tplayer.cartridgeLoaded = true;
//      } else{
//        $("#e-cartridge").fadeIn(1000);
//      }
//      
//      $("#e-play").css("cursor", "not-allowed").css("pointer-events", "none").delay(1500).css("pointer-events", "auto").css("cursor", "auto");
//
//      $("#e-cartridge").css("background", scenes.cartridge.color);
//      $("body").css("background", scenes.cartridge.color);
//      
//      return true;
//    } else {
//      $("#e-cartridge").fadeOut();
//      return false;
//    }
  },
  
  loadCartridge: function () {

//      $("#e-cartridge").css("background", scenes.cartridge.color);
    $("#e-cartridge h1[cartridge-title]").html(scenes.title);
    
  },

  loadColor: function () {

    let c = (Tplayer.active).color;

    if (c == 0) {
      c = "#ffffff"; // default color
    }

    $("#e-play").css("background", c);
    $("body").css("background", c);

  },
  loadPlay: function(x, y) {

  $("#play h2").html("<span>Starting " + scenes.title +"...</span>").fadeIn("slow");
    Tplayer.active = scenes.s[sceneControls.getSceneIndex(x, y)];
    
  // Is there a song?
  if (scenes.audio !== null) {
    Tplayer.playSong();
  }

  // does the game have a cartridge?
    
    $("#play").css("cursor", "not-allowed").css("pointer-events", "none").delay(2000).css("pointer-events", "auto").css("cursor", "auto");

    // load the cartridge, if this is a replay
    if ($("#e-cartridge").css("display") == "none") {
      $("#e-cartridge").fadeIn(300).delay(2000).fadeOut(1000);

    } else {
      // first, fade out cartridge very slowly lol
      $("#e-cartridge").delay(1000).fadeOut(1000);
    }
    
    // FIX FONT
    $("#e-text textarea").css("font-size", scenes.font_size + "px"); // change font size
    $("#e-text textarea").css("letter-spacing", scenes.font_letterspacing + "px"); // change font size
    $("#e-text textarea").css("line-height", scenes.font_lineheight + "px"); // change font size

  // change text
  setTimeout(function () {
    $("#play h2").html("<span class='_playwhatscene'></span><span class='_title'>Play</span>")

    if (Tplayer.active.title !== "Scene") {
      $("._title").text(Tplayer.active.title);
    }

    $("._playwhatscene").text((Tplayer.active).x + "," + (Tplayer.active).y);
    Tplayer.loadScene(x, y);
  }, 2000);


  $("#e-play").css("background", (Tplayer.active).color);
},
  /* clearScene deletes all objects from the scene */
  clearScene: function () {

    $("#e-play #e-effects").css("background-image", "none").css("background", "none").css("backdrop-filter", "none").css("box-shadow", "none");
    $("#e-play textarea").val("");
    $("#e-controls").attr("title", "");
  
  }
};


let played = false;

$("#btn-play").on("click", function () {

  $("#play").attr("tabindex", 0).focus();
  window.addEventListener("keydown", arrow_keys_handler, false);

  Tplayer.loadPlay(scenes.start_scene.x, scenes.start_scene.y);
});


$("#btn-clear").on("click", function () {
  $("#e-play").css("background", globals.BG_default);
  Tplayer.clearGame();
  Tplayer.loadCover();
});
