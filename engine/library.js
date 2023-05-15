console.log("library.js loaded");

/* 

  libraryEffects 
  handles all effects functions...
  
  
*/

const libraryEffects = {

  change: function (what) {

    libraryEffects.clear();

    if (!libraryEffects.exists(what)) {
      $("#e #e-effects").data("active", "none");
      $("select[name='effects-category']").val("none");
      return;
    }

    $("#e #e-effects").data("active", what);
    $("select[name='effects-category']").val(what);

    switch (what) {
      case "flowerpetals":
        libraryEffects.changeBG("flowerpetals.gif");
        $("#e #e-effects").css("background-size", "cover");
        break;

      case "softblur":
        $("#e #e-effects").css("backdrop-filter", "blur(1px)");
        break;

      case "mediumblur":
        $("#e #e-effects").css("backdrop-filter", "blur(3px)");
        break;

      case "hardblur":
        $("#e #e-effects").css("backdrop-filter", "blur(12px)");
        break;

      case "lightshadow":
        $("#e #e-effects").css("box-shadow", "inset 0 0 50px #fff");
        break;

      case "mediumshadow":
        $("#e #e-effects").css("box-shadow", "inset 0 0 100px #fff");
        break;

      case "hardshadow":
        $("#e #e-effects").css("box-shadow", "inset 0 0 100px #fff, inset 0 0 200px #fff");
        break;

      case "redshadow":
        $("#e #e-effects").css("box-shadow", "inset 0 0 100px red");
        break;

      case "hardredshadow":
        $("#e #e-effects").css("box-shadow", "inset 0 0 200px red, inset 0 0 400px red");
        break;
    }

    libraryEffects.saveEffect();
  },

  exists: function (what) {
    return $("select[name='effects-category']  option[value='" + what + "']").length > 0;
  },


  // saveEffect: save effect into active scene
  saveEffect: function () {
    active_scene.effect = $("#e-effects").data("active");
    active_scene.effects = $("#e-effects").attr("style");
  },

  changeBG: function (what) {

    $("#e #e-effects").css("background-image", "url('https://engine.lol/alpha/assets/effects/" + what + "'");
  },

  clear: function () {
    $("#e #e-effects")
      .css("mix-blend-mode", "none")
      .css("backdrop-filter", "none")
      .css("filter", "none")
      .css("box-shadow", "none")
      .css("color", "none")
      .css("background", "none")
      .css("background-size", "cover")
      .css("background-image", "none");
  }

}


/* 

  libraryText 
  handles all text editing functions...
  
*/

const libraryText = {

  $EDITbtn: "#btn-edittextoverlay",
  $SAVEbtn: "#btn-savetextoverlay",
  $TEXT_EDITOR: "e textarea",
  $TEXT: "e #e-text",
  fonts: ["Times Now", "Comic Sans MS", "Arial", "FA Sysfont C", "Helvetica", "Courier New", "Georgia", "Garamond", "Tahoma", "Arial Black", "Brush Script MT", "Verdana", "Trebuchet MS"],

  init: function () {
    // click, edit text
    $("#e").on("click", function () {

      libraryText.toggleText();
    });

    $("button#btn-changefonttext").on("click", function () {
      libraryText.changeFont();
    });

    $("#" + libraryText.$TEXT_EDITOR).keyup(function () {
      libraryText.saveText();
    });


    $("#" + libraryText.$TEXT_EDITOR).keyup(function () {
      libraryText.saveText();
    });
  },

  isTextOn: function () {
    if ($("button#btn-toggletext").hasClass("__toggled")) {
      return true;
    }

    return false;
  },

  toggleText: function () {

    if (libraryText.isTextOn()) {
      $("button#btn-toggletext").text("Write  text");
      window.removeEventListener("keydown", arrow_keys_handler, false);
      window.addEventListener("keydown", arrow_keys_handler, false);
      $("button#btn-toggletext").removeClass("__toggled");
      $("#e #e-text textarea").removeClass("__toggled");
    } else {
//
//      objControls.clearSelected();
//      objControls.saveObjects();
      $("button#btn-toggletext").text("Stop editing text");
      $("#e #e-text textarea").focus();
      window.removeEventListener("keydown", arrow_keys_handler, false);
      $("#e #e-text textarea").addClass("__toggled");
      $("button#btn-toggletext").addClass("__toggled");
    }

    if ($("#e #e-text").css("pointer-events") == "none") {
      $("#" + libraryText.$TEXT).css("pointer-events", "all");
    } else {
      $("#" + libraryText.$TEXT).css("pointer-events", "none");
    }

    libraryText.saveText();
  },

  changeFont: function () {

    let font_random = libraryText.fonts[Math.floor(Math.random() * (libraryText.fonts).length)];

    scenes.font = font_random;

    $("#e textarea").css("font-family", font_random);
    $("#e-play textarea").css("font-family", font_random);
  },

  // loadText: laod text into active scene
  loadText: function () {

    var t = active_scene.textoverlay;

    if (t == null || t == undefined) {
      t = "";
    }

    t = t.replace(/\\n/g, "\n").replace(/&nbsp;/g, " ");

    $("#" + libraryText.$TEXT_EDITOR).hide().fadeIn(100).val(t);
  },

  clearText: function () {
    $("#" + libraryText.$TEXT_EDITOR).val("");
  },

  // saveText: save text into active scene
  saveText: function () {

    let t = $("#" + libraryText.$TEXT_EDITOR).val();
    // preserve whitespace

    if (t !== null) {
      //      t = t.replace( / /g, "&nbsp;" );
    }

    active_scene.textoverlay = t;
  },

  disableText: function () {
    // first, save
    libraryText.saveText();
    // disable text editing
    $("#" + libraryText.$TEXT_EDITOR).css("pointer-events", "none");
    $("#" + libraryText.$TEXT).css("pointer-events", "none");
  }
}

libraryText.init();


$("#e").click(function(){
  libraryText.toggleText();
})

/*


  LIBRARY
  

*/



/* 

  libraryControls
  Handles the library objects that appear
  
  
*/


// scene 
$("#library-scene-controls select[name='effects-category']").change(function () {
  let n = $("#library-scene-controls select[name='effects-category']").val();

  let t = $("#library-scene-controls select[name='effects-category']").find(":selected").attr("title");

  libraryEffects.change(n);
});


// caption 
$("input[name='caption']").keyup(function () {
  let t = $(this).val();
  $("#e").attr("title", t);
  active_scene.caption = t;
});


// scene title 
$("input[name='title']").keyup(function () {
  let t = $(this).val();
  $("._scenetitle").text(t);
  active_scene.title = t;
});


// cartridge title 
$("input[name='cartridge-title']").keyup(function () {
  let t = $(this).val();
  $("*[cartridge-title]").html(t);
  scenes.title = t;
  document.title = t;
});



$("#objectinteractions select[name='objinteraction-select']").change(function () {

  let how = $("#objectinteractions select[name='objinteraction-select']").val();

  $("#e img.obj[data-selected='1']").attr("data-interaction", how);
});


