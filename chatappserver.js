//create server and client array
var WebSocketServer = require("ws").Server;
var server = new WebSocketServer({port: 3000});
var clientlog = [];
var messagelog = [];
var bannedWords = ["previously enjoyed", "North Korea", "hate"];

//listen for connections
server.on("connection", function(client) {
  //verify connection
  console.log("client connected.")
  client.send(JSON.stringify("Connected to chatroom."));

  //send message history to newly connected clients
  messagelog.forEach(function(a) {
    client.send(a);
  })

  //capture client in clientlog
  clientlog.push(client)

  //capture messages in message log and send to all connected clients
  client.on("message", function(input) {
    console.log(input);
    messagelog.push(input);
    bannedWords.forEach(function(b) {
      var bannedIndex = input.search(b)
      if (bannedIndex !== -1) {
        console.log("client disconnected due to foul language");
        client.send(JSON.stringify("You are being kicked from the chatroom due to foul language."));
        var remove = clientlog.indexOf(client);
        clientlog.splice(remove,1);
        client.close();
      }
    })
      clientlog.forEach(function(c) {
        c.send(input)
    })
  })

  //remove clients on close...need to figure out how to remove from list on html page...
  client.on("close", function() {
    console.log("client disconnected");
    clientlog.forEach(function(x){
      if (x === client) {
        var remove = clientlog.indexOf(x);
        clientlog.splice(remove,1);
        x.close();
      }
    })
  })

})
