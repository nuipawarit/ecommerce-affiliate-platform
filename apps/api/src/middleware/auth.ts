import type { RequestHandler } from 'express';

export const requireAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing authorization header'
      }
    });
    return;
  }

  const apiKey = authHeader.replace('Bearer ', '').trim();

  if (!process.env.API_KEY) {
    console.error('API_KEY environment variable is not set');
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Authentication is not configured'
      }
    });
    return;
  }

  if (apiKey !== process.env.API_KEY) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid API key'
      }
    });
    return;
  }

  next();
}
