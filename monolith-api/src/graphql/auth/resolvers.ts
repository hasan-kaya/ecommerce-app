import { setAuthCookies } from '@/auth/utils/cookie';
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
    login: async (
      _parent: unknown,
      args: { input: { email: string; password: string } },
      context: GraphQLContext
    ) => {
      const { email, password } = args.input;
      const result = await authService.login(email, password);

      if (context.res) {
        setAuthCookies(context.res, result);
      }

      return result;
    },

    register: async (
      _parent: unknown,
      args: { input: { email: string; name: string; password: string } },
      context: GraphQLContext
    ) => {
      const { email, name, password } = args.input;
      const result = await authService.register(email, name, password);

      if (context.res) {
        setAuthCookies(context.res, result);
      }

      return result;
    },

    refreshToken: async (
      _parent: unknown,
      args: { refreshToken: string },
      context: GraphQLContext
    ) => {
      const token = args.refreshToken || context.res?.req.cookies?.refresh_token;
      const result = await authService.refreshToken(token);

      if (context.res) {
        setAuthCookies(context.res, result);
      }

      return result;
    },
  },
};
