$("#jump").on("click", "a", function(){
  
  let to = $(this).attr("jump");
  if(!to) return;
  
  $(".screen").hide();
  $("#jump div[screen]").hide();
  $(".screen[screen='"+to+"']").show();
  $("#jump div[screen='"+to+"']").show();
  
});

//$("#-editor").hide();
$("*[screen='player']").hide();

