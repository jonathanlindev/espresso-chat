import path from 'path';
import dotenv from 'dotenv';

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import formatMessage from './utils/messages';
import {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} from './utils/users';
dotenv.config();

const PORT = process.env.PORT || 3002;

const app = express();
const httpServer = createServer(app);
/**
 * Socket.IO is restricted to only localhost:5177
 */
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5177', // Vite default port
    // origin: "*",
    methods: ['GET', 'POST'],
  },
});

const botName = 'ChatCord Bot';

// Middleware
// This allows ALL origins to communicate with your Express server
app.use(cors());
/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * handle requests for static files
 */
app.use(express.static(path.resolve(__dirname, '../client')));

// Basic route
app.get('/api', (req, res) => {
  res.json({ message: 'Chat API is running on ' + PORT });
});

// Socket.io connection listen to event connection
io.on('connection', (socket) => {
  console.log('connection: User connected:', socket.id);

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    console.log('joinRoom: User joined room:', JSON.stringify(user));

    socket.join(user.room);

    // new web socket connection
    /*
     *  emits to all users
     *
     *  io.emit()
     */

    // emits to single client
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    /*
     *  broadcast message to all users except sender(user who is connecting
     *
     *  socket.broadcast.emit()
     */

    //broadcast to room
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat.`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    // console.log('************************* chatMessage received: ' + socket.id);
    const user = getCurrentUser(socket.id);
    console.log('chatMessage: ' + JSON.stringify(user));
    // Emit message to all users
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    console.log('User disconnected:', JSON.stringify(user));
    if (user) {
      // socket.broadcast
      //   .to(user.room)
      //   .emit(
      //     'message',
      //     formatMessage(user.username, `${user.username} has left the chat.`)
      //   );

      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat.`)
      );

      // Update user side list
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
