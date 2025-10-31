import { Router, Request, Response } from 'express';

import { authenticate, AuthRequest } from '@/auth/middleware';
import { setAuthCookies } from '@/auth/utils/cookie';
import { asyncHandler } from '@/common/middleware/error';
import { sendSuccess } from '@/common/utils/response';
import { AuthService } from '@/services/AuthService';
import { registerSchema, loginSchema, refreshTokenSchema } from '@/validators/auth.validators';

const router = Router();
const authService = new AuthService();

router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(
      validatedData.email,
      validatedData.name,
      validatedData.password
    );

    setAuthCookies(res, result);
    return sendSuccess(res, result, 201);
  })
);

router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData.email, validatedData.password);

    setAuthCookies(res, result);
    return sendSuccess(res, result);
  })
);

router.post(
  '/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = refreshTokenSchema.parse(req.body);
    const result = await authService.refreshToken(validatedData.refresh_token);

    setAuthCookies(res, result);
    return sendSuccess(res, result);
  })
);

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await authService.me(req.user!.userId);
    return sendSuccess(res, user);
  })
);

export default router;
