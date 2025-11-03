import { authTypeDefs } from './auth';
import { cartTypeDefs } from './cart';
import { categoryTypeDefs } from './category';
import { orderTypeDefs } from './order';
import { productTypeDefs } from './product';
import { walletTypeDefs } from './wallet';

const baseTypeDefs = `#graphql
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [
  baseTypeDefs,
  authTypeDefs,
  cartTypeDefs,
  categoryTypeDefs,
  orderTypeDefs,
  productTypeDefs,
  walletTypeDefs,
];
