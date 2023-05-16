// CORE
// Contains globals and such

var globals = {

  // maximum objects allowed per scene
  MAX_object_count: 15,

  // map width (columns)
  MAP_width: 7,

  // map height (rows)
  MAP_height: 7,
  
  BG_default: "#FFFFFF"

}



/* SCENES */
// collection of all scenes

const scenes = {

  scene_count: 1,
  start_scene: {
    x: 3,
    y: 3
  },
  cartridge: null, // will be the starting screen to the game
  audio: null,
  audio_loop: true,
  font: "default",
  font_size: 16,
  font_lineheight: 20,
  font_letterspacing: 0,
  title: "Game",

  // ALL THE SCENESKMFAKSF
  s: new Array(globals.MAP_width * globals.MAP_height)
};



      arrow_keys_handler = function(e) {
        switch (e.code) {
          case "ArrowUp":
          case "ArrowDown":
          case "ArrowLeft":
          case "ArrowRight":
          case "Space":
            e.preventDefault()
        }
      };


