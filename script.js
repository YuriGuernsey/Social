var DIR = 'http://localhost:8888/api/'
var quill;
var clicked = false;
$('.search > form > textarea').click(function(){

if(clicked == true){
clicked = false;
}
else{
$('.search > form > textarea').val('');
 quill = new Quill('#editor', {
    theme: 'snow'
  });
$('button.contentButton').fadeIn();
$(this).attr('type', '');
$('.search > form > textarea').text('');
clicked = true;

}
})

$('html').click(function(e) {                    
   if(!$(e.target).parent().hasClass('contentForm'))
   {
$('button.contentButton').fadeOut();
      destory_editor('#editor');     
      $('.search > form > textarea').val('');
      $('.search > form > textarea').text('');
      
      clicked = false;         
   }
   else{

$('button.contentButton').fadeIn();
$(this).attr('type', '');
$('.search > form > textarea').text('');
clicked = true;
   }
}); 

function destory_editor(selector){
    if($(selector)[0])
    {
        var content = $(selector).find('.ql-editor').html();
        $(selector).html(content);

        $(selector).siblings('.ql-toolbar').remove();
        $(selector + " *[class*='ql-']").removeClass (function (index, class_name) {
           return (class_name.match (/(^|\s)ql-\S+/g) || []).join(' ');

        });

        $(selector + "[class*='ql-']").removeClass (function (index, class_name) {
           return (class_name.match (/(^|\s)ql-\S+/g) || []).join(' ');
        });
    }
    
}

$("#contentSubmit").submit(function(e) {
    e.preventDefault();
    var editor_content = $(this).children('textarea').val();
       $.ajax({
        url: DIR + 'functions.php',
        type: 'POST',
        data: { "content":editor_content },
        success: function(response) { console.log(response);
              window.location = window.location;
         }
    });
      
});



$(document).ready(function(){
       checkUserLogin();
       
                $.ajax({
        url: DIR + 'functions.php',
        type: 'POST',
        data: { "getLogin":'true' },
        success: function(response) { 
              var profileJson =  JSON.parse(response);
              $('img#userProfileImg').attr('src', profileJson.profileImg);
              $(".userMenu > p").text(profileJson.username)
         }
    });

$.ajax({
        url: DIR + 'functions.php',
        type: 'POST',
        data: { "getPosts":'true' },
        success: function(response) { 
             
              var postsJson =  JSON.parse(response);
              if(postsJson.length < 1)
                     {
                               var contentHTML = " <div class='contatiner' id='content'><div class='contentContatiner' ><p> No Content </p></div></div>";
$("#contentSection").append(contentHTML);
                     }else{
              for(var i = 0; i < postsJson.length; i++){
                        var contentHTML = " <div class='contatiner hide' id='content'><div class='contentContatiner' ><div class='topBar'><div class='user'>@"+ postsJson[i].UserName +"</div><div class='actionBtn'></div></div><div class='content'><p>"+ postsJson[i].Content + "</p></div><div class='bottomBar'>Comment button and reaction button</div></div>";
$("#contentSection").append(contentHTML);
              }
              $("div[id*='content']").each(function (i, el) {
                     var maxDelay = i * 100;
                     $(el).stop(true, true).delay(10 + maxDelay).animate({left:'0'}, maxDelay);
                 
     });
       }
         }
    });

              
      
      });


function checkUserLogin(){
         $.ajax({
        url: DIR + 'functions.php',
        type: 'POST',
        data: { "getLogin":'true' },
        success: function(response) { 
           if(response == 0){
              window.location.replace("/login.html");
          
           }

      
         }
    });
}