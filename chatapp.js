//create WebSocket
var client = new WebSocket("ws://ciara.princesspeach.nyc");

client.addEventListener("open", function(evt) {

  //VARIABLES
  //grab body and list elements
  var body = document.querySelector("body");
  var ul = document.querySelector("ul");
  //users window -- get user name section
  var getUsername = document.querySelector("#username");
  var submitUsername = document.querySelector("#submitusername");
  var usernameText = document.querySelector("#usertextbox");
  //chat window
  var logout = document.querySelector("#logout");
  var chatwindow = document.querySelector("#chatwindow");
  var submitChat = document.querySelector("#submitchat");
  var userInput = document.querySelector("#textbox")
  //jukebox buttons
  var jukebuttons = document.querySelectorAll("#jukebutton");
  var song1 = document.querySelector("#song1");
  var song2 = document.querySelector("#song2");
  var song3 = document.querySelector("#song3");
  //client's list of clients
  var userList = [];
  //userID
  var user = {
    nm: "",
    msg: "",
    type: "",
    special: ""
  };
  //special features
  var specialFeatures = [".com",".gov",".nyc",".org","yell",".jpg",".png",".bmp",".gif"];
  var specialIndex = "";

  //set scroll default to bottom
  var scroll = function(area) {
    area.scrollTop = area.scrollHeight;
  }

  //get username - submit button event listener
  submitUsername.addEventListener("click", function() {
    user.nm = usernameText.value;
    user.type = "username"
    //update user list with ID
    getUsername.removeChild(submitUsername);
    getUsername.removeChild(usernameText);
    var welcome = document.querySelector("#welcome");
    welcome.innerHTML = "WELCOME " + user.nm.toUpperCase();
    //
    client.send(JSON.stringify(user))
  })

  //get username - enter event listener
  usernameText.addEventListener("keydown", function(press) {
    if (press.keyCode === 13) {
      submitUsername.click();
    }
  })

  //send messages to server on submit chat button click
  submitChat.addEventListener("click", function() {
    if (user.nm === "") {
      alert("Please enter a username");
    }
    else {
      user.msg = userInput.value;
      user.type = "clientmsg"
      client.send(JSON.stringify(user));
      userInput.value = "";
    }
  })

  //send messages to server on enter
  userInput.addEventListener("keydown", function(press) {
    if (press.keyCode === 13) {
      submitChat.click();
    }
  })

  //listen for messages from server
  client.addEventListener("message", function(evt) {

    var newMessage = document.createElement("p");
    var serverMsg = JSON.parse(evt.data);

    //messages from server (just text)
    if (serverMsg.type === "servermsg") {
      newMessage.innerHTML = serverMsg.msg;
      chatwindow.appendChild(newMessage);
    }

    //messages from server (user list)
    if (serverMsg.type === "userlog") {
      //remove existing list
      var allUsers = document.querySelectorAll("li");
      for (var i = 0; i < allUsers.length; i++) {
        ul.removeChild(allUsers[i]);
      }
      //replace with updated list
      var users = serverMsg.msg;
      users.forEach(function(elem) {
        var newLi = document.createElement("li");
        newLi.innerHTML = elem;
        ul.appendChild(newLi);
      })
    }

    //messages from server (bad user)
    if (serverMsg.type === "kicked") {
      var chatroom = document.querySelector("#chatroom");
      body.removeChild(chatroom);
      var kickout = document.createElement("p");
      kickout.innerHTML = 'Princess Peach says: "' + serverMsg.msg + '"';
      body.appendChild(kickout);
    }

    //messages from users (sent via server)
    if (serverMsg.type === "clientmsg") {

        //search for special features and set special value....
        specialFeatures.forEach(function(elem) {
          var specialIndex = (serverMsg.msg).search(elem)
          //if special feature...
            if (specialIndex !== -1) {
              serverMsg.special = elem
            }
        });

        //if no special feature:
        if (serverMsg.special === "") {
          newMessage.innerHTML = serverMsg.nm + ": " + serverMsg.msg;
          chatwindow.appendChild(newMessage);
          scroll(chatwindow);
        }

        //if yell:
        if (serverMsg.special === "yell") {
          var yellmsg = ((serverMsg.msg).slice(specialIndex+5)).toUpperCase();
          newMessage.innerHTML = serverMsg.nm + ": " + yellmsg;
          chatwindow.appendChild(newMessage);
          scroll(chatwindow);
        }

        //if image or gif:
        if (serverMsg.special === ".jpg" || serverMsg.special === ".png" || serverMsg.special === ".bmp" || serverMsg.special === ".gif") {
          var image = document.createElement("img");
          image.setAttribute("src", serverMsg.msg);
          image.setAttribute("width", "300px");
          newMessage.innerHTML = serverMsg.nm + ": ";
          chatwindow.appendChild(newMessage);
          chatwindow.appendChild(image);
          scroll(chatwindow);
        }

        //if link:
        if (serverMsg.special === ".com" || serverMsg.special === ".gov" || serverMsg.special === ".nyc" || serverMsg.special === ".org") {
          newMessage.innerHTML = serverMsg.nm + ": <a href = " + serverMsg.msg + ">" + serverMsg.msg + "</a>";
          chatwindow.appendChild(newMessage);
          scroll(chatwindow);
        }
    }

    //songs
    var song1 = new Audio("https://www.freesound.org/data/previews/145/145596_2583849-lq.mp3");
    var song2 = new Audio("https://www.freesound.org/data/previews/154/154492_2337290-lq.mp3");
    var song3 = new Audio("https://www.freesound.org/data/previews/170/170986_35187-lq.mp3");
    var song4 = new Audio("https://www.freesound.org/data/previews/32/32090_114160-lq.mp3");
    var song5 = new Audio("https://www.freesound.org/data/previews/51/51242_179538-lq.mp3");
    var song6 = new Audio("https://www.freesound.org/data/previews/104/104718_7037-lq.mp3");
    var song7 = new Audio("https://www.freesound.org/data/previews/137/137227_1735491-lq.mp3");
    var song8 = new Audio("https://www.freesound.org/data/previews/126/126421_1666767-lq.mp3");


    //play or stop songs
    if (serverMsg.type === "tunes") {
      if (serverMsg.msg === "song1") {
        if (serverMsg.special === "stop") {
          pause();
        }
        if (serverMsg.special === "play") {
          song1.play();
        }
      }
      if (serverMsg.msg === "song2") {
        if (serverMsg.special === "stop") {
          pause();
        }
        if (serverMsg.special === "play") {
          song2.play();
        }
      }
      if (serverMsg.msg === "song3") {
        if (serverMsg.special === "stop") {
          pause();
        }
        if (serverMsg.special === "play") {
          song3.play();
        }
      }
      if (serverMsg.msg === "song4") {
        if (serverMsg.special === "stop") {
          pause();
        }
        if (serverMsg.special === "play") {
          song4.play();
        }
      }
      if (serverMsg.msg === "song5") {
        if (serverMsg.special === "stop") {
          pause();
        }
        if (serverMsg.special === "play") {
          song5.play();
        }
      }
      if (serverMsg.msg === "song6") {
        if (serverMsg.special === "stop") {
          pause();
        }
        if (serverMsg.special === "play") {
          song6.play();
        }
      }
      if (serverMsg.msg === "song7") {
        if (serverMsg.special === "stop") {
          pause();
        }
        if (serverMsg.special === "play") {
          song7.play();
        }
      }
      if (serverMsg.msg === "song8") {
        if (serverMsg.special === "stop") {
          pause();
        }
        if (serverMsg.special === "play") {
          song8.play();
        }
      }
    }

  });

  //send message to play song to server
  var sendPlay = function(song) {
    user.type = "tunes";
    user.msg = song;
    user.special = "play";
    client.send(JSON.stringify(user));
  }

  //send message to stop song to server
  var sendStop = function(song) {
    user.type = "tunes";
    user.msg = song;
    user.special = "stop";
    client.send(JSON.stringify(user));
  }

  //listen for jukebox button click -- song 1
  var counter1 = 0;
  song1.addEventListener("click", function(evt) {

    counter1 ++
    if (counter1 % 2 === 0) {
      sendStop("song1");
    }
    else {
      sendPlay("song1");
    }
  })

  //listen for jukebox button click -- song 2
  var counter2 = 0;
  song2.addEventListener("click", function(evt) {
    counter2 ++
    if (counter2 % 2 === 0) {
      sendStop("song2");
    }
    else {
      sendPlay("song2");
    }
  })

  //listen for jukebox button click -- song 3
  var counter3 = 0;
  song3.addEventListener("click", function(evt) {
    counter3 ++
    if (counter3 % 2 === 0) {
      sendStop("song3");
    }
    else {
      sendPlay("song3");
    }
  })

  //listen for jukebox button click -- song 4
  var counter4 = 0;
  song4.addEventListener("click", function(evt) {
    counter4 ++
    if (counter4 % 2 === 0) {
      sendStop("song4");
    }
    else {
      sendPlay("song4");
    }
  })

  //listen for jukebox button click -- song 5
  var counter5 = 0;
  song5.addEventListener("click", function(evt) {
    counter5 ++
    if (counter5 % 2 === 0) {
      sendStop("song5");
    }
    else {
      sendPlay("song5");
    }
  })

  //listen for jukebox button click -- song 6
  var counter6 = 0;
  song6.addEventListener("click", function(evt) {
    counter6 ++
    if (counter6 % 2 === 0) {
      sendStop("song6");
    }
    else {
      sendPlay("song6");
    }
  })

  //listen for jukebox button click -- song 7
  var counter7 = 0;
  song7.addEventListener("click", function(evt) {
    counter7 ++
    if (counter7 % 2 === 0) {
      sendStop("song7");
    }
    else {
      sendPlay("song7");
    }
  })

  //listen for jukebox button click -- song 8
  var counter8 = 0;
  song8.addEventListener("click", function(evt) {
    counter8 ++
    if (counter8 % 2 === 0) {
      sendStop("song8");
    }
    else {
      sendPlay("song8");
    }
  })

  //listen for logout and send user info to server to remove from list
  logout.addEventListener("click", function() {
    user.type = "exit";
    console.log(user);
    client.send(JSON.stringify(user));
    var chatroom = document.querySelector("#chatroom");
    body.removeChild(chatroom);
    var logout = document.createElement("p");
    logout.innerHTML = 'Princess Peach says, "Peace!"';
    body.appendChild(logout);
  })


});
