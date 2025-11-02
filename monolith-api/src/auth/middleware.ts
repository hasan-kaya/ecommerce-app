import { Request, Response, NextFunction } from 'express';

import { Scope, ScopeGroups, hasScopes } from './scopes';

import { sendError } from '@/common/utils/response';
import { SessionService } from '@/services/SessionService';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    scopes: string[];
  };
}

const sessionService = new SessionService();

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cookieToken = req.cookies?.['session_token'];

    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const token = cookieToken || bearerToken;

    if (!token) {
      return sendError(res, 'No authorization token provided', 401);
    }

    const session = await sessionService.getSession(token);

    if (!session) {
      return sendError(res, 'Invalid or expired session', 401);
    }

    await sessionService.refreshSession(token);

    req.user = {
      userId: session.userId,
      email: session.email,
      scopes: session.role === 'admin' ? [...ScopeGroups.ADMIN] : [...ScopeGroups.USER],
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return sendError(res, 'Authentication failed', 401);
  }
};

export const requireScopes = (...scopes: Scope[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    const userScopes = req.user.scopes || [];

    if (!hasScopes(userScopes, scopes)) {
      return sendError(res, `Insufficient permissions. Required scopes: ${scopes.join(', ')}`, 403);
    }

    next();
  };
};
