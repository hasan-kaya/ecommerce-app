import { adminResolvers } from './admin';
import { authResolvers } from './auth';
import { cartResolvers } from './cart';
import { categoryResolvers } from './category';
import { orderResolvers } from './order';
import { productResolvers } from './product';
import { walletResolvers } from './wallet';

export const resolvers = {
  Query: {
    ...adminResolvers.Query,
    ...authResolvers.Query,
    ...cartResolvers.Query,
    ...categoryResolvers.Query,
    ...productResolvers.Query,
    ...walletResolvers.Query,
    ...orderResolvers.Query,
  },
  Mutation: {
    ...cartResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...walletResolvers.Mutation,
    ...categoryResolvers.Mutation,
  },
  Product: productResolvers.Product,
  CartItem: cartResolvers.CartItem,
  Wallet: walletResolvers.Wallet,
  WalletTransaction: walletResolvers.WalletTransaction,
  Order: orderResolvers.Order,
};
