import { Request } from 'express';

// Get user ID from authenticated request
export const getUserKey = (req: Request): string => {
  const user = (req as any).user;
  return user?.id || user?.userId || 'anonymous';
};

// Get client IP address from request
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
};
