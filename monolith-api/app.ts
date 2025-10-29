import 'reflect-metadata';
import 'tsconfig-paths/register';
import express from 'express';
import { AppDataSource } from '@/config/data-source';
import authRoutes from '@/rest/auth.routes';
import categoryRoutes from '@/rest/category.routes';
import productRoutes from '@/rest/product.routes';
import cartRoutes from '@/rest/cart.routes';
import { errorHandler } from '@/common/middleware/error';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

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
