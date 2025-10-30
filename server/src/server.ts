import path from 'path';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

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
  // new web socket connection
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
