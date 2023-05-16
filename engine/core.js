// CORE
// Contains globals and such

var globals = {

  // maximum objects allowed per scene
  MAX_object_count: 15,

  // map width (columns)
  MAP_width: 6,

  // map height (rows)
  MAP_height: 6,
  
  BG_default: "#FFFFFF"

}



/* SCENES */
// collection of all scenes

const scenes = {

  scene_count: 1,
  start_scene: {
    x: 2,
    y: 2
  },
  cartridge: null, // will be the starting screen to the game
  audio: null,
  audio_loop: true,
  font: "default",
  font_size: 16,
  font_lineheight: 16,
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


