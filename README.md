# Princess Peach Chat App

## About

This chat app was created using vanilla JavaScript, node.js, and WebSockets - specifically ws (a node.js websocket implementation).

Our class name happened to be 'Princess Peach' - hence the inspiration for the application.

We had not yet learned databases, so the information is not persisted in a database; however, the client log and message history is stored in an array during the session.

### Features

Some special features include:

  - **Banned Words**: a select list of banned words (inspired by the hooligans in my class) that will kick users from the session if used.
  - **Links**: renders links with any of the following extensions: ".com",".gov",".nyc",".org"
  - **Images / Gifs**: renders images and gifs with any of the following extensions: ".jpg",".png",".bmp",".gif"
  - **Yell**: upcases any message if 'yell' preceeds the message
  - **Jukebox**: plays select sounds from Peach's personal playlist

![image] (./chat_app.png)
