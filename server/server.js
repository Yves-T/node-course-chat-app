const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname + "/../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.emit("newMessage", {
    from: "mike@example.com",
    text: "Hey what is going on?",
    createdAt: 123123
  });

  socket.on("createMessage", newMessage => {
    console.log("createMessage:", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("disconnected from the server");
  });
});

server.listen(port, function() {
  console.log(`App listening on port ${port}!`);
});
