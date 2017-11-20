const socket = io();
socket.on("connect", () => {
  console.log("connected to server");
});

socket.on("disconnect", () => {
  console.log("disconnected from the server");
});

socket.on("newMessage", message => {
  console.log("new message", message);
});
