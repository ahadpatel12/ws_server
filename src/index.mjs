// index.js

import path from 'path';
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import formatMessage from './helper/formatDate.mjs';
// import { fileURLToPath } from 'url';

import { getActiveUser, exitRoom, newUser, getIndividualRoomUsers } from './helper/userHelper.mjs';

// const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
// const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set public folder
// app.use(express.static(path.join(__dirname), 'public'));

// this block will run when the client connects
io.on('connection', socket => {
  socket.on('createRoom',({username,room}) => {
    const user = newRoom(socket.id, username, room);
    


  } )

  socket.on('joinRoom', ({ username, room }) => {
    const user = newUser(socket.id, username, room);
    
    socket.join(user.room);

    // General welcome
    socket.emit('message', formatMessage("WebCage", 'Messages are limited to this room! '));

    // Broadcast everytime users connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage("WebCage", `${user.username} has joined the room`)
      );

    // Current active users and room name
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    });
  });

  // Listen for client message
  socket.on('chatMessage', msg => {
    const user = getActiveUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = exitRoom(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage("WebCage", `${user.username} has left the room`)
      );

      // Current active users and room name
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getIndividualRoomUsers(user.room)
      });
    }
  });
  console.log("Socket connected");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));