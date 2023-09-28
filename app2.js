const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index2.html');
})

const users = {};
const userSockets = {};

io.on('connection', (socket) => {
  socket.on('new-user', (username) => {
    users[socket.id] = username;
    userSockets[username] = socket;
    io.emit('user-connected', username);
    io.to(socket.id).emit('user-list', Object.values(users).filter(user => user !== username));
  });

  socket.on('send-private-message', ({ targetUser, message }) => {
    const targetSocket = userSockets[targetUser];
    if (targetSocket) {
      targetSocket.emit('private-message', { user: users[socket.id], message });
    }
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      io.emit('user-disconnected', username);
      delete users[socket.id];
      delete userSockets[username];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
