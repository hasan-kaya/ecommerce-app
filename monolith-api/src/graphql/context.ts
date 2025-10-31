import { Request, Response } from 'express';

import { GraphQLContext } from '@/graphql/utils/auth';
import { AuthService } from '@/services/AuthService';

const authService = new AuthService();

export const createContext = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<GraphQLContext> => {
  // Try to get token from cookie first, then fallback to Authorization header
  const token = req.cookies?.access_token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return { res };
  }

  try {
    const decoded = authService.verifyToken(token);
    return { userId: decoded.userId, res };
  } catch {
    return { res };
  }
};
