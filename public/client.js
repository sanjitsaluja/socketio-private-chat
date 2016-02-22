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
  var recipient = getRecipient(text_message);  
  if (recipient != null && recipient.length > 0) {
    var message = {
      to: recipient,
      from: login,
      message: text_message,
      type: "text_message",
    }
    sendMessage(message);
    $('#messages').append($('<li>').text("You" + ": " + text_message));
    $('#m').val('').trigger('input');
  }
  return false;
});

var previous_typing_recipient = null;

$('#m').on('input', function(e){
  var text_message = $('#m').val();
  var recipient = getRecipient(text_message);
  if (previous_typing_recipient != recipient) {
    var message = {
      to: previous_typing_recipient,
      from: login,
      type: "not_typing",
    };
    sendMessage(message);
    previous_typing_recipient = null;
  }
  
  if (previous_typing_recipient == null)
  {
    var message = {
      to: recipient,
      from: login,
      type: "typing",
    };
    sendMessage(message);
    previous_typing_recipient = recipient;
  }
});

function sendMessage(message) {
  if (message.to && message.from && message.type) {
    console.log("Sending message:");
    console.log(message);
    socket.emit(public_channel, message);
  }
}

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
  var sender = msg.from;
  if (msg.type == "text_message") 
  {
    var message = msg.message;
    $('#messages').append($('<li>').text(sender + ": " + message));
  }
  else if (msg.type == "typing")
  {
    $('#messages').append($('<li>').addClass(sender + "-typing").text(sender + " is typing"));
  }
  else if (msg.type == "not_typing")
  {
    $("li." + sender + "-typing").remove();
  }
}

///////////////////////////////////////////////////
/// Helper Methods
///////////////////////////////////////////////////

function getRecipient(text_message) {
  recipient = text_message.match(/@\w*\s/) || [];
  return recipient[0] ? recipient[0].trim().substr(1) : null;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};
