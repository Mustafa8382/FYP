import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import emailRoutes from './routes/email.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('✅ Connected to MongoDB!');
  })
  .catch((err) => {
    console.log('❌ MongoDB connection error:', err);
  });

  const __dirname = path.resolve();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // ✅ API Routes
  app.use('/Api/user', userRouter);
  app.use('/Api/auth', authRouter);
  app.use('/Api/listing', listingRouter);
  app.use('/Api/email', emailRoutes);

  // ✅ Serve frontend
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });

  // ✅ Global error handler
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });

// ✅ Start the server
app.listen(3000, () => {
  console.log('🚀 Server is running on http://localhost:3000');
});
