# private-chat-example

This is very simple private chatting node js app based on [socket.io](http://socket.io/get-started/chat/).

# Features
- Send messages to user via syntax "@username lorem ipsum"
- Typing notifiations

# Installation

```sh
npm install
node . 
```

# Usage

Open 2 tabs with 2 users. The login parameter is your username. http://localhost:3000?login=user1 & http://localhost:3000?login=user2.

## Sending messages

```
@username Lorem ipsum
```

# Design

All clients listen on their own private channel for new messages. Only the server can publish on this channel. Incoming messages include new private text messages, typing notifications, read & delivered notifications.

To send a private message to another client, the clients talk to the server on the public channel. Clients can only publish to this channel. Only the server listens on this channel. On incoming messages, the server will decide the correct recipient of the message and deliver it to them on their private channel.