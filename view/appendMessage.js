var gChatLog = [];
var messageId = 1;
var botMessage = _.template(`<div class="chat bot">
                    <div class="user-photo"><img src="img/img1.png"></div>
                    <p class="chat-message"><%= text %><p class="time" style="right: -295px;"><small><%= time %></small></p>
                    </p>
                </div>`);
var userMessage = _.template(`<div class="chat user">
                    <div class="user-photo"><img src="img/img2.jpg"></div>
                    <p class="chat-message"><%= text %><p class="time" style="right: -238px;"><small><%= time %></small></p>
                    </p>
                </div>`);
$(document).ready(function() {
    $.ajax({
        url:'/getChatlogs/',
        method: 'GET',
        success:function(res){
            loadMessages(res.chatlogs);
        },
        error:function(){
            console.log('Error occured');
        }
    })
});

function loadMessages(msgArr){
    if(!msgArr || msgArr.length == 0){
        console.log("loadMessages: No messages found to load");
    }
    msgArr.forEach( (msg) => {
        if(msg.messageId){
            var date  = new Date(Number(msg.timestamp));
            var time = formatAMPM(date);
            msg.time = time;
            var newDiv;
            if(msg.senderID == 'bot'){
               newDiv =  botMessage(msg);
            } else {
                newDiv =  userMessage(msg);
            }
            $('.chatlogos').append(newDiv);
            scroll('normal');
        }
    });

}
function appendMessages(){
    var messageNode = $('textarea');
    //console.log(message.val());
    var message = $.trim(messageNode.val(),'\n');
    if(message == '' || message == null){
        alert('Please enter message');
        messageNode.focus();
        return;
    }
    var date = formatAMPM(new Date());
    var divsLength = $(".chatlogos > div").length
    var botDiv = `<div class="chat bot">
                        <div class="user-photo"><img src="img/img1.png"></div>
                        <p class="chat-message">${message} <p class="time" style="right: -295px;"><small>${date}</small></p>
                        </p>
                    </div>`;
    var userDiv = `<div class="chat user">
                    <div class="user-photo"><img src="img/img2.jpg"></div>
                    <p class="chat-message">${message} <p class="time" style="right: -238px;"><small>${date}</small></p>
                    </p>
                </div>`;

    var newDiv = divsLength%2==0 ? botDiv : userDiv;

    //Construction message object
    /*
    * Message Object:
    *   messageId:
    *   senderID:
    *   text:
    *   timestamp:
    */
   message = message.replace(/\n/gm," ");
   console.log(message);
    gChatLog.push({
        messageId:messageId,
        senderID:divsLength%2==0 ? "bot" : "user",
        text:message,
        timestamp: Date.now()
    });
    messageId++;
    var oldScrollHeight = $('#chatlogos')[0].scrollHeight;
    console.log(oldScrollHeight);
    $('.chatlogos').append(newDiv);

     //To scroll after the new message
     var newscrollHeight = $("#chatlogos")[0].scrollHeight+10;
     console.log("newscrollHeight:"+newscrollHeight);
     if(newscrollHeight > oldScrollHeight)   {
         $("#chatlogos").animate({ scrollTop: newscrollHeight }, 'slow'); //Autoscroll to bottom of div
     }
     messageNode.val("");
     $('button').attr('disabled','true');

}
function scroll(speed){
    speed = !speed ? 'slow' : speed;
    var scrollHeight = $("#chatlogos")[0].scrollHeight+10;
    $("#chatlogos").animate({ scrollTop: scrollHeight+20 }, speed);
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

//Should be last function
$(window).on("beforeunload", function() {
    $.ajax({
        url:'/saveChatlogs/',
        method: 'POST',
        dataType: "json",
        data:{chatLog: JSON.stringify(gChatLog)},
        success:function(res){
            console.log("saveChatlogs :" + res)
        },
        error:function(err){
            console.log(err);
        }
    })
})