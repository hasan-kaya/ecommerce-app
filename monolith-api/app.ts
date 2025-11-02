import 'reflect-metadata';
import 'tsconfig-paths/register';
import { expressMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { oidc } from '@/auth/oidc-provider';
import oidcRoutes from '@/auth/oidc.routes';
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
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// OIDC Routes
app.use('/interaction', oidcRoutes);
app.use('/oidc', oidc.callback());

// Rest Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/orders', orderRoutes);

// Error Handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    const { connectRedis } = await import('@/config/redis');
    await connectRedis();
    console.log('Redis connection established');

    // GraphQL Server
    const apolloServer = createApolloServer();
    await apolloServer.start();

    app.use(
      '/graphql',
      expressMiddleware(apolloServer, {
        context: createContext,
      })
    );

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
      console.log(`OIDC issuer: http://localhost:${PORT}/oidc`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
