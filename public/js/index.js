const socket = io();
socket.on("connect", function() {
  console.log("connected to server");

  socket.emit("createMessage", {
    from: "jen@example.com",
    text: "Hey this is Andrew"
  });
});

socket.on("disconnect", function() {
  console.log("disconnected from the server");
});

socket.on("newMessage", function(message) {
  console.log("new message", message);
});
