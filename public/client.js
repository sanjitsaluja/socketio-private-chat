var socket = io();

var login = getParameterByName("login");

if (!login) {
  alert("Supply login parameter");
}

// Channel server is listening on
// All clients can publish
var public_channel = "channel_public";

// Incoming messages channel
var private_channel = "channel_" + login;

$('form').submit(function(){
  var text_message = $('#m').val();
  recipients = text_message.match(/@\w*/g, '');
  console.log(recipients);
  for (var i = 0; i < recipients.length; i++) {
    var recipient = recipients[i].substr(1);;
    var message = {
      to: recipient,
      from: login,
      message: text_message,
      type: "text_message",
    }
    console.log("Sending message:");
    console.log(message);
    socket.emit(public_channel, message);
  }
  $('#messages').append($('<li>').text("You" + ": " + text_message));
  $('#m').val('');
  return false;
});

socket.on(private_channel, function(msg){
  var message = msg.message;
  var sender = msg.from;
  console.log("Received message:");
    console.log(msg);
  $('#messages').append($('<li>').text(sender + ": " + message));
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}