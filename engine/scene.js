console.log("scene.js loaded");



/*

  SCENE CONSTRUCTOR
  x, y: variable
  active
  
  
*/
function Scene(x, y, active, color, object_count) {

  // scene coordinates
  this.x = x;
  this.y = y;

  // has this scene been edited?
  this.active = active;

  // background color of the scene
  this.color = color;
  // any text
  this.textoverlay = "";
  // any effects
  this.effect = "";
  this.effects = "";

  // scene title
  this.title = "";

  // scene caption
  this.caption = "";

  this.object_count = 0;
  this.objects = [];
}


/*


    REMIXING A CARTRIDGE
    / LOADING A CARTRIDGE
    
    
*/

function testJSON(text) {
  if (typeof text !== "string") {
    return false;
  }
  try {
    var json = JSON.parse(text);
    return (typeof json === 'object');
  } catch (error) {
    return false;
  }
}


$("#btn-remix").on("click", function () {

  if (!confirm("Do you want to paste in a cartridge code and start editing an existing game? (Note that this wipes all of your current progress!)")) {
    return;
  }
  
  new_cartridge = prompt("Paste in your cartridge code here.");
  
  new_cartridge = new_cartridge.replace(/^\s+|\s+$/g, "")
    .replace(/\\n/g, "\\n")
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "\\t")
    .replace(/\\b/g, "\\b")
    .replace(/\\f/g, "\\f");

  new_cartridge = new_cartridge.replace(/[\u0000-\u0019]+/g, "");

  console.log("Attempting to load: ", new_cartridge);

  let new_scenes = "";

  if (testJSON(new_cartridge)) {
    new_scenes = JSON.parse(new_cartridge);
    // just checking if this is valid or not
    if (new_scenes.start_scene == null || new_scenes.s == null) {
      alert("Corrupted or empty cartridge!!!!");
      return;
    }

  } else {
    alert("Corrupted or empty cartridge!");
    return;
  }

  console.log("Loaded: ", new_scenes);

  if ((new_scenes.s).length !== (globals.MAP_height * globals.MAP_width)) {
    alert("This cartridge is sized differently. Adjusting the player...");

    let new_size = (100 / Math.sqrt((new_scenes.s).length)) - 3;

    //    $("#scene_s ._s").css("flex-basis", new_size + "% !important");
    $("#scene_s #scene_selector ._s").css("flex-basis", "23%");
    $("#scene_s #scene_selector ._s").css("padding", ".2em .5em");

    let c = Math.sqrt((new_scenes.s).length);

    globals.MAP_width = c;
    globals.MAP_height = c;

  }

  // copy
  scenes.audio = new_scenes.audio;
  scenes.font = new_scenes.font;

  if (scenes.font !== "default") {

    $("#e-play textarea").css("font-family", scenes.font);
    $("#e textarea").css("font-family", scenes.font);
  }

  mapControls.clearMap();
  sceneControls.reassignScenes(new_scenes);
  mapControls.loadMap(scenes);

  let i = sceneControls.getSceneIndex(scenes.start_scene.x, scenes.start_scene.y);

  Tplayer.loadCover();
  sceneControls.switchScene(i);

  document.getElementById("window-engine").scrollIntoView();

  $("#map .controls-remixcartridge").hide();

  $("#map textarea#_remix").val("").hide();
  $("#map #sss").fadeIn();
  $("#btn-cartridge").fadeIn();
  $("#btn-remixcartridge").fadeIn();
  $("#btn-changestartingscene").fadeIn();

  alert("Successfully loaded cartridge");  
});




/* 




      SCENE CONTROLS
      
      
      


*/


const sceneControls = {

  /* 
    getScene
    give x, y
    returns the index based on simple formula
    
  */

  getSceneIndex: function (x, y) {

    let i = (parseInt(x) * globals.MAP_width) + parseInt(y);

    return i;
  },

  /* 
    getScene
    give x, y
    returns scene object
  */

  getScene: function (x, y) {

    let i = (parseInt(x) * globals.MAP_width) + parseInt(y);
    return scenes.s[i];
  },

  /* 
    reassignScenes
    give a new scene object
    and update the scenes
  */

  reassignScenes: function (new_scene) {

    if (!new_scene) {
      return;
    }

    scenes.scene_count = new_scene.scene_count;
    scenes.start_scene = new_scene.start_scene;
    scenes.cartridge = new_scene.cartridge;
    scenes.s = new_scene.s;

  },

  copyScene: function (target, source) {

    target.x = source.x;
    target.y = source.y;
    target.color = source.color;
    target.object_count = source.object_count;
    target.objects = source.objects;
    target.textoverlay = source.textoverlay;
    target.effect = source.effect;
    target.effects = source.effects;
    target.title = source.title;
    target.caption = source.caption;

  },
  /* 
    checkActive
    see if given scene is the active scene
    
  */

  checkActive: function (s) {

    if (!s) {
      // you must provide a scene object
      return false;
    }

    if (active_scene.x == s.x && active_scene.y == s.y && active_scene.textoverlay == s.textoverlay && active_scene.effect == s.effect && active_scene.effects == s.effects && active_scene.color == s.color && active_scene.title == s.title && active_scene.caption == s.caption) {
      return true;
    }
    return false;

  },

  /*
  
    switchScene
    i: index of new scene (NOT coordinate value)
    o: index of old scene
  
  */
  switchScene: function (i, o) {
    

    sceneControls.saveScene();
    sceneControls.clearScene();
    $("input[name='caption']").val("");
    $("input[name='title']").val("");

    // set to new active scene
    active_scene = scenes.s[i];

    sceneControls.loadColor();
    sceneControls.loadText();
    sceneControls.loadTitle();
    sceneControls.loadEffect();
    
    libraryText.toggleText();
    
    
    // Updating active scene text
    $("._whatscene").text(active_scene.x + "," + active_scene.y);

  },


  /* saveScene writes all objects and settings to the active scene */
  saveScene: function () {
    libraryText.saveText();

//    if (libraryText.isTextOn()) {
//      libraryText.toggleText();
//    }

    libraryEffects.saveEffect();

    active_scene.caption = $("#e").attr("title");
    active_scene.title = $("._scenetitle").text();

  },
  /* clearScene deletes all objects from the scene */
  clearScene: function () {

    libraryEffects.clear();
    libraryText.clearText();
    $("#e").attr("title", ""); // caption
    $("._scenetitle").text("Scene"); // title
    $("input[name='caption']").val("");
    $("input[name='title']").val("");

  },

  loadColor: function () {

    if (active_scene.color == 0) {
      active_scene.color = "#ffffff";
    }

    $("input[type='color']").val(active_scene.color);
    $("#e").css("background", active_scene.color);
    $("body").css("background", active_scene.color);
  },

  loadText: function () {
    // loads text into editor
    let t = active_scene.textoverlay;
    t = t.replace(/&nbsp;/g, " ");

    $("#e #e-text textarea").hide().delay(100).fadeIn("slow").val(t);
  },

  loadEffect: function () {
    if (!active_scene.effect) return;

    // loads effect into the editor
    libraryEffects.clear();
    libraryEffects.change(active_scene.effect);
  },

  loadCaption: function () {
    if (!active_scene.caption) return;
    $("input[name='caption']").val(active_scene.caption);
    $("#e").attr("title", active_scene.caption);
  },

  loadTitle: function () {

    if (!active_scene.title) return;

    $(".library-scene-controls input[name='title']").val(active_scene.title);
    if (active_scene.title.length == 0 || active_scene.title == "Scene") {
      $("._scenetitle").text("Scene");
      $("input[name='title']").val("");
    } else {
      $("._scenetitle").text(active_scene.title);
      $("input[name='title']").val(active_scene.title);
    }
  },

  /*
    loadObjects brings back all the objects from the scene into the frame, lodaing it from the array of objects
  */

  loadObjects: function () {

    // iterate over each object
//    (active_scene.objects).forEach(function (e) {
//      objControls.addObj(e.img, e.x, e.y, e.filter, e.flip, e.size, e.interaction, e.interaction_target);
//    })

  },

  initColorpicker: function () {

    $("input[type='color']").change(function () {

      let c = $(" input[type='color']").val();

      $("#e").css("background", c);
      $("body").css("background", c);

      active_scene.color = c;

      // change color of tile in map
      $("#scene_selector div._s.__active").css("background", c);
    });

  },

  editCartridge: function () {

    $("#btn-savecartridge").fadeIn("slow");
    $("#btn-finishediting").fadeOut("slow");
    $(".sidebar-right").fadeOut("slow");

    libraryText.saveText();
    libraryEffects.saveEffect();
//    objControls.saveObjects();
    sceneControls.clearScene();
    let c = scenes.cartridge;

    // MAP:remove the old scene
    $("#" + mapControls.MASTER + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");
    $("#" + mapControls.SIDE + " ._s[data-scene='" + active_scene.x + "," + active_scene.y + "']").removeClass("__active").addClass("__inactive");

    // MAP: clear all the __active classes
    $("#" + mapControls.MASTER + " ._s").each(function (i, item) {
      $(item).removeClass("__active")
    });
    $("#" + mapControls.SIDE + " ._s").each(function (i, item) {
      $(item).removeClass("__active")
    });

    // make cartridge for the first time
    if (c == null) {

      scenes.cartridge = new Scene(-1, -1, true, globals.BG_default, "", "", "", "", "", 0);
      active_scene = scenes.cartridge;

      // reset colors
      $("#e").css("background", globals.BG_default);
      $("body").css("background", globals.BG_default);
      $("input[type='color']").val(globals.BG_default);

    } else {
      active_scene = scenes.cartridge;
//      sceneControls.loadObjects();
    }

    $("._whatscenetype").text("Cartridge");
    $(".whatscene").text("");

  },

  saveCartridge: function () {

    objControls.clearSelected();
    console.log("saving cartridge", active_scene);
    $("#e-cartridge").html("");
    objControls.saveObjects();
    scenes.cartridge = active_scene;
    

    // update the colors
    $("#e-cartridge").css("background", (scenes.cartridge).color);
    $("#btn-savecartridge").fadeOut("slow");

    $(".sidebar-right").fadeIn("slow");


  }

};

/*

    SCENE CONTROLS
    
    
*/

$("#library-scene-controls button#btn-scenecontrols-deletescene").on("click", function () {

  if (active_scene.x == scenes.start_scene.x && active_scene.y == scenes.start_scene.y) {
    alert("You can't delete your starting scene.");
    return;
  }

  if (!confirm("Do you want to delete your active scene, " + active_scene.x + "," + active_scene.y + "?")) {
    return;
  }

  let old_x = active_scene.x;
  let old_y = active_scene.y;

  // switch to starting scene
  sceneControls.clearScene();

  sceneControls.switchScene(sceneControls.getSceneIndex(scenes.start_scene.x, scenes.start_scene.y));
  scenes.s[sceneControls.getSceneIndex(old_x, old_y)] = null;

  mapControls.updateMap();

  alert("Scene " + old_x + "," + old_y + " deleted");

})

var copy_scene = null;

$("#library-scene-controls button#btn-scenecontrols-copyscene").on("click", function () {

  copy_scene = null;

  copy_scene = JSON.parse(JSON.stringify(active_scene));

  alert("Copied scene " + active_scene.x + "," + active_scene.y + "!");

  $("button#btn-scenecontrols-pastescene").css("opacity", "1");

})


$("#library-scene-controls button#btn-scenecontrols-pastescene").on("click", function () {


  if (copy_scene == null) {
    alert("You haven't selected a scene to copy!")
    return;
  }


  if (!confirm("Do you want to replace this scene with contents from " + copy_scene.x + "," + copy_scene.y + "? This overwrites the current scene!")) {
    return;
  }

  sceneControls.clearScene();

  // loadObjects
//  (copy_scene.objects).forEach(function (e) {
//    objControls.addObj(e.img, e.x, e.y, e.filter, e.flip, e.size, e.interaction, e.interaction_target);
//  })
//  
//    $("#e .obj").each(function () {
//      $(this)
//        .bind("dblclick", objControls.selectObj);
//    });


  // loadColor

  if (copy_scene.color == 0) {
    // defaults to black if color isn't set
    copy_scene.color = "#ffffff";
  }

  $("#e").css("background", copy_scene.color);
  $("body").css("background", copy_scene.color);

  active_scene.color = copy_scene.color;

  $("#scene_selector div._s.__active").css("background", copy_scene.color);

  // loadText
  let t = copy_scene.textoverlay;
  t = t.replace(/&nbsp;/g, " ");
  $("#e #e-text textarea").hide().delay(100).fadeIn("slow").val(t);

  // loadEffects
  libraryEffects.clear();
  libraryEffects.change(copy_scene.effect);

  // loadTitle
  $(".library-scene-controls input[name='title']").val(copy_scene.title);
  if (copy_scene.title.length == 0 || copy_scene.title == "Scene") {
    $("._scenetitle").text("Scene");
    $("input[name='title']").val("");
  } else {
    $("._scenetitle").text(copy_scene.title);
    $("input[name='title']").val(copy_scene.title);
  }


  alert("Successfully copied scene " + copy_scene.x + "," + copy_scene.y + "!");

})



/* ON CLICK LISTENERS */

sceneControls.initColorpicker();

//$("#btn-cartridge").on("click", function () {
//
//  // disable text
//  if ($("button#btn-toggletext").hasClass("__toggled")) {
//    $("#e #e-text").css("pointer-events", "none");
//    $("button#btn-toggletext").removeClass("__toggled");
//  }
//
//  objControls.clearSelected();
//  $("#tool-textoverlay").fadeOut();
//  sceneControls.editCartridge();
//  alert("Now editing the game cartridge—your game's cover. Saves automatically!");
//});


$("#btn-savecartridge").on("click", function () {
  $("#tool-textoverlay").fadeIn();
  objControls.clearSelected();
  sceneControls.saveCartridge();
  alert("Cartridge saved!");
});
