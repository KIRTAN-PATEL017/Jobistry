import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import proposalRoutes from './routes/proposals.js';
import contractRoutes from './routes/contract.js';
import messageRouter from './routes/messages.js'

import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

import Message from './models/Message.js';
import Conversation from './models/Conversation.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://jobistry.vercel.app', // your frontend
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'https://jobistry.vercel.app',
  credentials: true,
}));

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/messages', messageRouter);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', ({ conversationId }) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('sendMessage', async ({ conversationId, sender, recipient, content }) => {
  try {
    // Save message to DB
    const newMessage = new Message({
      conversation: conversationId,
      sender,
      recipient,
      content,
    });
    await newMessage.save();

    // Emit full message details including conversation ID
    io.to(conversationId).emit('receiveMessage', {
      _id: newMessage._id,
      sender: newMessage.sender,
      recipient: newMessage.recipient,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
      read: newMessage.read,
      conversation: newMessage.conversation,
    });

  } catch (err) {
    console.error('Error saving message:', err);
  }
});

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
