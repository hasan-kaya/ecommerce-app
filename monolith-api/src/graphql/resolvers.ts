import { authResolvers } from './auth';
import { cartResolvers } from './cart';
import { categoryResolvers } from './category';
import { productResolvers } from './product';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...categoryResolvers.Query,
    ...productResolvers.Query,
  },
  Mutation: {
    ...cartResolvers.Mutation,
  },
  Product: productResolvers.Product,
  CartItem: cartResolvers.CartItem,
};
