var socket = io();

// login serves are your credential
// People can send you messages with @login
var login = getParameterByName("login");
if (!login) {
  alert("Supply login parameter");
  $("#title").text("Reload page with login parameter");
} else {
  $("#title").text("You are logged in as " + login);
}

// Channel server is listening on.
// This is the channel on which all clients send messages to server.
// Clients cannot send direct messages to another clients private channel.
var public_channel = "channel_public";

// Incoming messages channel
// This is the channel on which incoming messages will be delivered.
// Only server can send messages on this channel.
var private_channel = "channel_" + login;

///////////////////////////////////////////////////
/// Outgoing Messages
///////////////////////////////////////////////////

$('form').submit(function() {
  var text_message = $('#m').val();
  recipients = text_message.match(/@\w*/g, '');
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

///////////////////////////////////////////////////
/// Incoming Messages
///////////////////////////////////////////////////


// Listen for incoming messages on the private channel
socket.on(private_channel, function(msg){
  processIncomingMessage(msg);
});

function processIncomingMessage(msg) {
  console.log("Received message:");
  console.log(msg);
  if (msg.type == "text_message") 
  {
    var message = msg.message;
    var sender = msg.from;
    $('#messages').append($('<li>').text(sender + ": " + message));
  }
}

///////////////////////////////////////////////////
/// Helper Methods
///////////////////////////////////////////////////

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}