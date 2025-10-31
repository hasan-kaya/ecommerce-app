import { Response } from 'express';

import { parseExpiration } from './token';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

const getRefreshTokenMaxAge = (): number => {
  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  return parseExpiration(refreshTokenExpiry) * 1000;
};

export const setAuthCookies = (res: Response, tokens: AuthTokens): void => {
  res.cookie('access_token', tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tokens.expires_in * 1000,
  });

  res.cookie('refresh_token', tokens.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: getRefreshTokenMaxAge(),
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
};
