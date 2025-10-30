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

  Mutation: {
    login: async (_parent: unknown, args: { input: { email: string; password: string } }) => {
      const { email, password } = args.input;
      return authService.login(email, password);
    },

    register: async (
      _parent: unknown,
      args: { input: { email: string; name: string; password: string } }
    ) => {
      const { email, name, password } = args.input;
      return authService.register(email, name, password);
    },

    refreshToken: async (_parent: unknown, args: { refreshToken: string }) => {
      return authService.refreshToken(args.refreshToken);
    },
  },
};
