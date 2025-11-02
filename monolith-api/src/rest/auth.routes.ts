import { Router, Response } from 'express';

import { authenticate, AuthRequest } from '@/auth/middleware';
import { asyncHandler } from '@/common/middleware/error';
import { sendSuccess } from '@/common/utils/response';
import { AuthService } from '@/services/AuthService';

const router = Router();
const authService = new AuthService();

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await authService.me(req.user!.userId);
    return sendSuccess(res, user);
  })
);

export default router;
