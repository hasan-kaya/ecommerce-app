import { Request, Response, NextFunction } from 'express';

import { sendError } from '@/common/utils/response';
import { AuthService } from '@/services/AuthService';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

const authService = new AuthService();

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided', 401);
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);

    req.user = decoded;
    next();
  } catch {
    return sendError(res, 'Invalid token', 401);
  }
};
