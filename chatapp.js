//create WebSocket
var client = new WebSocket("ws://localhost:3000");

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

    console.log(serverMsg);
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

    //messages from users (sent via server)
    if (serverMsg.type === "clientmsg") {

      //DISPLAY MESSAGES...

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

    if (serverMsg.type === "tunes") {
      if (serverMsg.msg === "song1") {
        var song1 = new Audio("https://www.freesound.org/data/previews/145/145596_2583849-lq.mp3");
        song1.play();
      }
      if (serverMsg.msg === "song2") {
        var song2 = new Audio("https://www.freesound.org/data/previews/154/154492_2337290-lq.mp3");
        song2.play();
      }
      if (serverMsg.msg === "song3") {
        var song3 = new Audio("https://www.freesound.org/data/previews/170/170986_35187-lq.mp3");
        song3.play();
      }
      if (serverMsg.msg === "song4") {
        var song4 = new Audio("https://www.freesound.org/data/previews/32/32090_114160-lq.mp3");
        song4.play();
      }
      if (serverMsg.msg === "song5") {
        var song5 = new Audio("https://www.freesound.org/data/previews/51/51242_179538-lq.mp3");
        song5.play();
      }
      if (serverMsg.msg === "song6") {
        var song6 = new Audio("https://www.freesound.org/data/previews/104/104718_7037-lq.mp3");
        song6.play();
      }
      if (serverMsg.msg === "song7") {
        var song7 = new Audio("https://www.freesound.org/data/previews/137/137227_1735491-lq.mp3");
        song7.play();
      }
      if (serverMsg.msg === "song8") {
        var song8 = new Audio("https://www.freesound.org/data/previews/126/126421_1666767-lq.mp3");
        song8.play();
      }
    }

  });

  var sendSong = function(song) {
    user.type = "tunes";
    user.msg = song;
    console.log(user);
    client.send(JSON.stringify(user));
  }

  //listen for jukebox button click -- song 1
  song1.addEventListener("click", function(evt) {
    sendSong("song1");
  })

  //listen for jukebox button click -- song 2
  song2.addEventListener("click", function(evt) {
    sendSong("song2");
  })

  //listen for jukebox button click -- song 3
  song3.addEventListener("click", function(evt) {
    sendSong("song3");
  })

  //listen for jukebox button click -- song 4
  song4.addEventListener("click", function(evt) {
    sendSong("song4");
  })

  //listen for jukebox button click -- song 5
  song5.addEventListener("click", function(evt) {
    sendSong("song5");
  })

  //listen for jukebox button click -- song 6
  song6.addEventListener("click", function(evt) {
    sendSong("song6");
  })

  //listen for jukebox button click -- song 7
  song7.addEventListener("click", function(evt) {
    sendSong("song7");
  })

  //listen for jukebox button click -- song 8
  song8.addEventListener("click", function(evt) {
    sendSong("song8");
  })


  //listen for logout and send user info to server to remove from list
  logout.addEventListener("click", function() {
    user.type = "exit";
    console.log(user);
    client.send(JSON.stringify(user));
    close();
  })


});
