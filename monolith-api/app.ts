import 'reflect-metadata';
import 'tsconfig-paths/register';
import express from 'express';
import { AppDataSource } from '@/config/data-source';
import authRoutes from '@/rest/auth.routes';
import { errorHandler } from '@/common/middleware/error';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
  