import { Request, Response } from 'express';

import { GraphQLContext } from '@/graphql/utils/auth';
import { SessionService } from '@/services/SessionService';

const sessionService = new SessionService();

export const createContext = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<GraphQLContext> => {
  const cookieToken = req.cookies?.['session_token'];

  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  const token = cookieToken || bearerToken;

  if (!token) {
    return { res };
  }

  try {
    const session = await sessionService.getSession(token);

    if (!session) {
      return { res };
    }

    return { userId: session.userId, res };
  } catch (error) {
    console.error('GraphQL context error:', error);
    return { res };
  }
};
