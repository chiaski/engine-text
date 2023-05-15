$("#jump").on("click", "a", function(){
  
  let to = $(this).attr("jump");
  if(!to) return;
  
  $(".screen").hide();
  $(".screen[screen='"+to+"']").show();
  
});

//$("#-editor").hide();