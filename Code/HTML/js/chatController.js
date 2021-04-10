$('#form_chat').submit( () =>{
  let message = $('#chat').val();
  if(message != ''){
   		socket.emit('chat', message);
   		$('#chat').val('').focus();
  }
  return false;
});

socket.on('chat', (message)=>{
  let col = (c=='white')? 'w' : 'b';

  if(message.sender!=col && lectureMessage){// est vocale activé
    let speech = new SpeechSynthesisUtterance(message.vocale);
    speech.lang = "fr";
    window.speechSynthesis.speak(speech);
  }

  switch(message.sender){
    case col:
      $('#chat_zone').append('<p class="emis">'+message.text+'</p>');
      updateScroll();
      break;
    case 'console':
      $('#chat_zone').append('<p class="console">'+message.text+'</p>');
      updateScroll();
      break;
    default:
      $('#chat_zone').append('<p class="recu">'+message.text+'</p>');
      updateScroll();
  }

  function updateScroll(){
    var element = document.getElementById("chat_zone");
    element.scrollTop = element.scrollHeight;
}
});
