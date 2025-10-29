import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export const sendSuccess = <T>(res: Response, data: T, statusCode: number = 200) => {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, message: string, statusCode: number = 500, details?: any) => {
  const response: ApiResponse = {
    success: false,
    error: message,
    ...(details && { details })
  };
  return res.status(statusCode).json(response);
};
