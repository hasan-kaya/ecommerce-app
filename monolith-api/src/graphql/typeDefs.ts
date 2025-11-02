import { authTypeDefs } from './auth';
import { productTypeDefs } from './product';

const baseTypeDefs = `#graphql
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [baseTypeDefs, authTypeDefs, productTypeDefs];
