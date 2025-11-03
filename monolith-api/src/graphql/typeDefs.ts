import { authTypeDefs } from './auth';
import { productTypeDefs } from './product';
import { categoryTypeDefs } from './category';

const baseTypeDefs = `#graphql
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [baseTypeDefs, authTypeDefs, productTypeDefs, categoryTypeDefs];
