//create server and client array
var WebSocketServer = require("ws").Server;
var server = new WebSocketServer({port: 3000});
var clientlog = [];
var messagelog = [];
var userList = ["Princess Peach"];
var bannedWords = ["previously enjoyed", "North Korea", "hate"];
var servermsg = {
  nm: "",
  msg: "",
  type: ""
}
//listen for connections
server.on("connection", function(client) {
  //verify connection
  console.log("client connected.")

  //send connected message
  servermsg.msg = "Connected to chatroom.";
  servermsg.type = "servermsg";
  client.send(JSON.stringify(servermsg));

  //send message history to newly connected clients
  messagelog.forEach(function(elem) {
    client.send(elem);
  })

  //send user list to newly connected clients
  servermsg.msg = userList;
  servermsg.type = "userlog";
  client.send(JSON.stringify(servermsg));

  //capture client in clientlog
  clientlog.push(client);

  //capture messages in message log and send to all connected clients
  client.on("message", function(input) {
    //parse message
    var message = JSON.parse(input);
    //regular client messages
    if (message.type === "clientmsg") {
      //push messages to message log
      messagelog.push(input);
      console.log(input);

      //send messages to clients
      clientlog.forEach(function(elem) {
        elem.send(input)
      })

      //kick off users that use banned words
      bannedWords.forEach(function(elem) {
        var bannedIndex = input.search(elem)
        if (bannedIndex !== -1) {
          console.log("client disconnected due to foul language");
          //send message to bad user
          servermsg.msg = "You are being kicked from the chatroom due to foul language.";
          servermsg.type = "kicked";
          client.send(JSON.stringify(servermsg));

          //remove from user list and send updated list
          var removeUser = userList.indexOf(message.nm);
          userList.splice(removeUser,1);
          servermsg.msg = userList;
          servermsg.type = "userlog"
          client.send(JSON.stringify(servermsg));

          //remove from client log
          var removeClient = clientlog.indexOf(client);
          clientlog.splice(removeClient,1);
          client.close();

          //advise other users bad user has been kicked
          servermsg.msg = message.nm + " has been kicked from the chatroom due to foul language";
          servermsg.type = "servermsg";
          var userkick = JSON.stringify(servermsg);
          messagelog.push(userkick);
          clientlog.forEach(function(elem) {
            elem.send(userkick);
          })
        }
      })
    }

    //username message
    if (message.type === "username") {
      //push user name to user list
      var uListindex = userList.indexOf(message.nm);
        if (uListindex === -1) {
          userList.push(message.nm);
          servermsg.msg = userList;
          servermsg.type = "userlog"
          //send user list to client
          clientlog.forEach(function(elem) {
            elem.send(JSON.stringify(servermsg));
          });
        }
    }

    //user exited chatroom...
    if (message.type === "exit") {
      var removeUser = userList.indexOf(message.nm);
      userList.splice(removeUser, 1);
      servermsg.msg = userList;
      servermsg.type = "userlog";
      //send updated user list to client
      clientlog.forEach(function(elem) {
        elem.send(JSON.stringify(servermsg));
      });
      //advise clients that user left chatroom
      servermsg.msg = message.nm + " has left the chatroom. Waaahhhhhhh!";
      servermsg.type = "servermsg";
      var userexit = JSON.stringify(servermsg);
      messagelog.push(userexit);
      clientlog.forEach(function(elem) {
        elem.send(JSON.stringify(servermsg));
      });
    }

    //user clicked music button
    if (message.type === "tunes") {
      servermsg.msg = message.msg;
      servermsg.type = "tunes";
      servermsg.special = message.special;
      console.log(servermsg);
      clientlog.forEach(function(elem) {
        elem.send(JSON.stringify(servermsg));
      });
    }

  })

  //remove clients on close...need to figure out how to remove from list on html page...
  client.on("close", function(input) {
    console.log("client disconnected");
    //remove from client log
    clientlog.forEach(function(elem){
      if (elem === client) {
        var removeClient = clientlog.indexOf(client);
        console.log(removeClient);
        clientlog.splice(removeClient,1);
        elem.close();
      }
    })
  })

})
