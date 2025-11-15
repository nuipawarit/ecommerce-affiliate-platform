import { Router, Request, Response, NextFunction } from 'express';
import { loginSchema } from '../validations/auth.validation';
import { generateToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'demo';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'demo123';

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { username, password } = validatedData;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = generateToken({
        username,
        role: 'admin',
      });

      res.json(successResponse({ token }));
      return;
    }

    res.status(401).json(errorResponse('Invalid username or password', 'INVALID_CREDENTIALS'));
  } catch (error) {
    next(error);
  }
});

export default router;
