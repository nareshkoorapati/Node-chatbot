function appendMessages(){
    var message = $('textarea');
    var date = formatAMPM(new Date());
    var divsLength = $(".chatlogos > div").length
    var botDiv = `<div class="chat bot">
                        <div class="user-photo"><img src="img/img1.png"></div>
                        <p class="chat-message">${message.val()} <p class="time" style="right: -295px;"><small>${date}</small></p>
                        </p>
                    </div>`;
    var userDiv = `<div class="chat user">
                    <div class="user-photo"><img src="img/img2.jpg"></div>
                    <p class="chat-message">${message.val()} <p class="time" style="right: -238px;"><small>${date}</small></p>
                    </p>
                </div>`;

    var newDiv = divsLength%2==0 ? botDiv : userDiv;
    var oldScrollHeight = $('.chatlogos').att("scrollHeight");
    console.log("oldScrollHeight:"+oldScrollHeight);
    $('.chatlogos').append(newDiv);

     //To scroll after the new message
     var newscrollHeight = $(".chatlogos").attr("scrollHeight");
     console.log("newscrollHeight:"+newscrollHeight);
     if(newscrollHeight > oldScrollHeight)   {
         $(".chatlogos").animate({ scrollTop: newscrollHeight }, 'normal'); //Autoscroll to bottom of div
     }
    message.val("");

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