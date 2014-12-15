//create WebSocket
var client = new WebSocket("http://ciara.princesspeach.nyc:3000");

client.addEventListener("open", function(evt) {

  //variables
  //grab body and list elements
  var body = document.querySelector("body");
  var ul = document.querySelector("ul");
  //users window -- get user name section
  var getUsername = document.querySelector("#username");
  var submitUsername = document.querySelector("#submitusername");
  var usernameText = document.querySelector("#usertextbox");
  //chat window
  var chatwindow = document.querySelector("#chatwindow");
  var submitChat = document.querySelector("#submitchat");
  var userInput = document.querySelector("#textbox")
  //client's list of clients
  var clientlog = [];
  //userID
  var user = {
    nm: "nousername",
    msg: ""
  };

  //get username - submit button event listener
  submitUsername.addEventListener("click", function() {
    user.nm = usernameText.value;
    //update user list with ID
    getUsername.removeChild(submitUsername);
    getUsername.removeChild(usernameText);
  })

  //get username - enter event listener
  usernameText.addEventListener("keydown", function(press) {
    if (press.keyCode === 13) {
      submitUsername.click();
    }
  })

  //send messages to server on submit chat button click
  submitChat.addEventListener("click", function() {
    user.msg = userInput.value;
    client.send(JSON.stringify(user));
    userInput.value = "";
  })

  //send messages to server on enter
  userInput.addEventListener("keydown", function(press) {
    if (press.keyCode === 13) {
      user.msg = userInput.value;
      client.send(JSON.stringify(user));
      userInput.value = "";
    }
  })

  //listen for messages from server
  client.addEventListener("message", function(evt) {

    var newMessage = document.createElement("p");
    var serverMsg = JSON.parse(evt.data);
    console.log(serverMsg);

    //messages from users....
    if (serverMsg.nm) {
      //add username to user list
      var index = clientlog.indexOf(serverMsg.nm);
      if (index === -1) {
        var newUser = document.createElement("li");
        newUser.innerHTML = serverMsg.nm;
        ul.appendChild(newUser);
      }

      //push username to client log
      clientlog.push(serverMsg.nm);

      // //remove disconnected clients...not working
      // if (serverMsg.msg === "remove") {
      //   var removeFromLog = clientlog.indexOf(serverMsg.nm);
      //   clientlog.splice(remove,1);
      //   var userList = document.querySelectorAll("li")
      //   var removeFromList = userList.indexOf(serverMsg.nm);
      //   var removeChild = userList[removeFromList]
      //   ul.removeChild(removeChild);
      // }

      //DISPLAY MESSAGE

      //yell messages - part 1
      var slashyellindex = serverMsg.msg.search("/yell")
      if (slashyellindex !== -1) {
        var slicemsg = serverMsg.msg.slice(slashyellindex+5)
        var yellmsg = slicemsg.toUpperCase();
        newMessage.innerHTML = serverMsg.nm + ": " + yellmsg
        chatwindow.appendChild(newMessage);
      }
      //yell messages - part 2
      var parenyellindex = serverMsg.msg.search("(yell)")
      if (parenyellindex !== -1) {
        var slicemsg = serverMsg.msg.slice(parenyellindex+6)
        var yellmsg = slicemsg.toUpperCase();
        newMessage.innerHTML = serverMsg.nm + ": " + yellmsg
        chatwindow.appendChild(newMessage);
      }

      //links -- not working...
        // if (serverMsg.msg.slice(0,4) === "http") {
        //   var link = document.createElement("a");
        //   link.setAttribute("href", serverMsg.msg);
        //   // newMessage.innerHTML = serverMsg.nm + ": ";
        //   // chatwindow.appendChild(newMessage);
        //   newMessage.innerHTML = serverMsg.nm + ": "
        //   chatwindow.appendChild(link);
        // }

      //images and gifs
      if (serverMsg.msg.slice(-3) === "jpg" || serverMsg.msg.slice(-3) === "png" || serverMsg.msg.slice(-3) === "bmp" || serverMsg.msg.slice(-3) === "gif") {
            var image = document.createElement("img");
            image.setAttribute("src", serverMsg.msg);
            image.setAttribute("width", "400px");
            newMessage.innerHTML = serverMsg.nm + ": ";
            chatwindow.appendChild(newMessage);
            chatwindow.appendChild(image);
          }

      //everything else...
      else {
        newMessage.innerHTML = serverMsg.nm + ": " + serverMsg.msg;
        chatwindow.appendChild(newMessage);
      }
    }
    //messages from server
    else {
      newMessage.innerHTML = serverMsg;
      chatwindow.appendChild(newMessage);
    }
  })

})
