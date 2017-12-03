const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { isRealString } = require('./utils/validation');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { Users } = require('./utils/users');

const publicPath = path.join(`${__dirname}/../public`);
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.broadcast.to(params.room).emit(
      'newMessage',
      generateMessage({
        from: 'Admin',
        text: `${params.name} has joined.`,
      }),
    );

    socket.emit(
      'newMessage',
      generateMessage({
        from: 'Admin',
        text: 'Welcome to the chat app',
      }),
    );
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit(
        'newMessage',
        generateMessage({
          from: user.name,
          text: message.text,
        }),
      );
    }
    callback('');
  });

  socket.on('createLocationMessage', coords => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'newLocationMessage',
        generateLocationMessage({
          from: user.name,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      );
    }
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('UpdateUserList', users.getUserList(user.room));
      io.to(user.room).emit(
        'newMessage',
        generateMessage({
          from: 'admin',
          text: `${user.name} has left.`,
        }),
      );
      io.to().emit();
    }
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
