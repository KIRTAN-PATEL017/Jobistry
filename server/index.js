import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';


import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
// import proposalRoutes from './routes/proposals.js';
// import contractRoutes from './routes/contracts.js';
// import reviewRoutes from './routes/reviews.js';
// import messageRoutes from './routes/messages.js';

// Middleware imports
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',  // your frontend URL
  credentials: true,                // allow cookies
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/projects', authenticateToken, projectRoutes);
// app.use('/api/proposals', authenticateToken, proposalRoutes);
// app.use('/api/contracts', authenticateToken, contractRoutes);
// app.use('/api/reviews', authenticateToken, reviewRoutes);
// app.use('/api/messages', authenticateToken, messageRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});