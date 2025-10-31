import { Request, Response, NextFunction } from 'express';

import { Scope, hasScopes } from './scopes';

import { sendError } from '@/common/utils/response';
import { AuthService } from '@/services/AuthService';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    scopes: string[];
  };
}

const authService = new AuthService();

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Try to get token from cookie first, then fallback to Authorization header
    let token = req.cookies?.access_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 'No token provided', 401);
      }
      token = authHeader.substring(7);
    }

    const decoded = authService.verifyToken(token);

    req.user = decoded;
    next();
  } catch {
    return sendError(res, 'Invalid token', 401);
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
