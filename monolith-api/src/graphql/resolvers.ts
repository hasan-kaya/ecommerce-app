import { authResolvers } from './auth';
import { categoryResolvers } from './category';
import { productResolvers } from './product';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...categoryResolvers.Query,
    ...productResolvers.Query,
  },
  Mutation: {},
  Product: productResolvers.Product,
};
