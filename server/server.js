const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message');

const publicPath = path.join(`${__dirname}/../public`);
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user connected');

  socket.broadcast.emit(
    'newMessage',
    generateMessage({
      from: 'Admin',
      text: 'New user joined',
    }),
  );

  socket.emit(
    'newMessage',
    generateMessage({
      from: 'Admin',
      text: 'Welcome to the chat app',
    }),
  );

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage:', message);
    io.emit(
      'newMessage',
      generateMessage({
        from: message.from,
        text: message.text,
      }),
    );
    callback('This is from the server');
  });

  socket.on('disconnect', () => {
    console.log('disconnected from the server');
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
