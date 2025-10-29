import 'reflect-metadata';
import 'tsconfig-paths/register';
import express from 'express';

import { errorHandler } from '@/common/middleware/error';
import { AppDataSource } from '@/config/data-source';
import authRoutes from '@/rest/auth.routes';
import cartRoutes from '@/rest/cart.routes';
import categoryRoutes from '@/rest/category.routes';
import orderRoutes from '@/rest/order.routes';
import productRoutes from '@/rest/product.routes';
import walletRoutes from '@/rest/wallet.routes';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/orders', orderRoutes);

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
