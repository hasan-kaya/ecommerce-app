import { authResolvers } from './auth';
import { productResolvers } from './product';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...productResolvers.Query,
  },
  Mutation: {},
  Product: productResolvers.Product,
};
