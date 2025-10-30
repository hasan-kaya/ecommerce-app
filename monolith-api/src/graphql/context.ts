import { Request } from 'express';

import { GraphQLContext } from '@/graphql/utils/auth';
import { AuthService } from '@/services/AuthService';

const authService = new AuthService();

export const createContext = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return {};
  }

  try {
    const decoded = authService.verifyToken(token);
    return { userId: decoded.userId };
  } catch {
    return {};
  }
};
