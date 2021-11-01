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
              $(".userMenu > p").text(profileJson.username  )
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
var likesBtnCnt;
              
                     if(postsJson[i].Likes > 1){
                           likesBtnCnt= "<span>"+postsJson[i].Likes+"</span> Likes";
                     }else{
likesBtnCnt= "<span>"+postsJson[i].Likes+"</span> Like";
                     }
                        var contentHTML = " <div class='contatiner hide' id='content'><div class='contentContatiner' ><div class='topBar'><div class='user'><img id='userProfileImg' src='https://www.gravatar.com/avatar/" + postsJson[i].Email +"?s=40'>@"+ postsJson[i].UserName +"</div><div class='actionBtn'></div></div><div class='content'><p>"+ postsJson[i].Content + "</p></div><div class='bottomBar'><button>Comment</button><button data-postID=" + postsJson[i].ID +" class='likeBTN' onClick='likePost(this)'>" +likesBtnCnt +"</button></div></div>";
$("#contentSection").append(contentHTML);
              }
              $("div[id*='content']").each(function (i, el) {
                     var maxDelay = i * 100;
                     $(el).stop(true, true).delay(10 + maxDelay).animate({left:'0'}, maxDelay);
                 
     });
       }
         }
    });
   


   $.ajax({
        url: DIR + 'functions.php',
        type: 'POST',
        data: { "getPOPPosts":'true' },
        success: function(response) { 
           
              var postsJson =  JSON.parse(response);
              console.log(postsJson);
            if(postsJson.length < 1)
                     {
                               var contentHTML = "<div><p>No trending posts</p></div>";
$("body > section > aside").append(contentHTML);
                     }else{
              for(var i = 0; i < 3; i++){
                     var today = new Date();
var datePosted = new Date(postsJson[i].DateCreated);
var diffMs = (today - datePosted); 
var diffDays = Math.floor(diffMs / 86400000); // days
var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

var timegone;
if(diffDays >= 30){
    timegone =  postsJson[i].DateCreated;
}
if(diffDays >= 1){
    timegone =  diffDays + ' days ago';
}
if(diffHrs >= 1 && diffDays < 1){
       timegone =  diffHrs + ' hours ago';
}
if(diffMins >= 1 && diffHrs < 1 && diffDays < 1){
       timegone =  diffMins + ' mins ago';
}
                        var contentHTML = "<div><h3>"+postsJson[i].Content+"</h3><div><p>@"+postsJson[i].UserName+"</p><p>"+ timegone +" </p> </div></div><br />";
$("body > section > aside").append(contentHTML);
              }
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


function likePost(el){
         console.log($(el).attr('data-postid'));
 $.ajax({
        url: DIR + 'functions.php',
        type: 'POST',
        data: { "postLiked":'true', "postID": $(el).attr('data-postID')},
        success: function(response) { 

              var currentLikes = parseInt($(el).children('span').text());
              var updatedLikes = currentLikes += 1;
              if(updatedLikes > 1){
                      $(el).html('<span>' +updatedLikes+'</span> Likes');
              }
       $(el).children('span').text(updatedLikes.toString());
         }
    });
}