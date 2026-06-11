import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware setup
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Root route for API health check
app.get('/', (req, res) => {
  res.json({ message: 'AI Chat Application API is running...' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
