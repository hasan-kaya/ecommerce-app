import { authResolvers } from './auth';
import { cartResolvers } from './cart';
import { categoryResolvers } from './category';
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
  },
  Product: productResolvers.Product,
  CartItem: cartResolvers.CartItem,
  Wallet: walletResolvers.Wallet,
};
