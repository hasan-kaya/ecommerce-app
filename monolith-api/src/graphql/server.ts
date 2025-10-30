import { ApolloServer } from '@apollo/server';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

export const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};
