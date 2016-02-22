var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Channel server is listening on
// All clients can publish
var public_channel = "channel_public";

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on(public_channel, function(message){
    console.log(message);
    // var message = JSON.parse(msg);
    if (message.to && message.from) {
      console.log("Sending message from "+ message.from + " to " + message.to);
      io.emit("channel_" + message.to, message);
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
