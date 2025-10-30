import path from 'path';
import dotenv from 'dotenv';

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import formatMessage from './utils/messages';
import { userJoin, getCurrentUser } from './utils/users';
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
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ username, room }) => {
    /*
    socket.join(room);
    socket.emit('message', formatMessage(botName, `You have joined ${room}`));
    socket.broadcast
      .to(room)
      .emit('message', formatMessage(botName, `A user has joined ${room}`));
*/
    // new web socket connection
    /*
   emits to all users
    io.emit()
  */

    // Welcome current user
    // emits to single client
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // broadcast message to all users except sender(user who is connecting
    socket.broadcast.emit(
      'message',
      formatMessage(botName, 'A user has joined the chat.')
    );
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    // Emit message to all users
    io.emit('message', formatMessage('user', msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // try socket.broadcast.emit
    io.emit('message', formatMessage(botName, 'A user has left the chat.'));
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
