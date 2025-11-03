import { authResolvers } from './auth';
import { cartResolvers } from './cart';
import { categoryResolvers } from './category';
import { orderResolvers } from './order';
import { productResolvers } from './product';
import { walletResolvers } from './wallet';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...cartResolvers.Query,
    ...categoryResolvers.Query,
    ...productResolvers.Query,
    ...walletResolvers.Query,
  },
  Mutation: {
    ...cartResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...walletResolvers.Mutation,
  },
  Product: productResolvers.Product,
  CartItem: cartResolvers.CartItem,
  Wallet: walletResolvers.Wallet,
  WalletTransaction: walletResolvers.WalletTransaction,
  Order: orderResolvers.Order,
};
