import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

import { getUserKey } from '@/common/utils/request';
import { redisClient } from '@/config/redis';

let ipLimiterInstance: any;
let authLimiterInstance: any;
let userLimiterInstance: any;

export const initRateLimiters = () => {
  ipLimiterInstance = rateLimit({
    windowMs: 60 * 1000,
    max: 100, // 100 requests per minute per IP
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      prefix: 'rl:ip:',
    }),
  });

  authLimiterInstance = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 attempts per 15 minutes per IP
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      prefix: 'rl:auth:',
    }),
  });

  userLimiterInstance = rateLimit({
    windowMs: 60 * 1000,
    max: 200, // 200 requests per minute per user
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getUserKey,
    skip: (req) => getUserKey(req) === 'anonymous',
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      prefix: 'rl:user:',
    }),
  });
};

export const ipLimiter = (req: any, res: any, next: any) => {
  if (!ipLimiterInstance) return next();
  return ipLimiterInstance(req, res, next);
};

export const authLimiter = (req: any, res: any, next: any) => {
  if (!authLimiterInstance) return next();
  return authLimiterInstance(req, res, next);
};

export const userLimiter = (req: any, res: any, next: any) => {
  if (!userLimiterInstance) return next();
  return userLimiterInstance(req, res, next);
};
