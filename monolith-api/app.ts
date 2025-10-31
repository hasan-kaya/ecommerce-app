import 'reflect-metadata';
import 'tsconfig-paths/register';
import { expressMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { errorHandler } from '@/common/middleware/error';
import { AppDataSource } from '@/config/data-source';
import { createContext } from '@/graphql/context';
import { createApolloServer } from '@/graphql/server';
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
app.use(cookieParser());

// REST Routes
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

    // GraphQL Server
    const apolloServer = createApolloServer();
    await apolloServer.start();

    app.use(
      '/graphql',
      cors<cors.CorsRequest>({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
      }),
      expressMiddleware(apolloServer, {
        context: createContext,
      })
    );

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
