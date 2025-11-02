import { GraphQLContext, requireAuth } from '@/graphql/utils/auth';
import { AuthService } from '@/services/AuthService';

const authService = new AuthService();

export const authResolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      const userId = requireAuth(context);
      return authService.me(userId);
    },
  },
};
