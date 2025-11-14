import type { Request, Response, NextFunction } from 'express';
import { MarketplaceError } from '@repo/adapters';
import { Prisma } from '@prisma/client';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  if (error instanceof MarketplaceError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MARKETPLACE_ERROR',
        message: error.message,
        marketplace: error.marketplace
      }
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ERROR',
          message: 'A record with this value already exists',
          field: error.meta?.target
        }
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Record not found'
        }
      });
    }
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message || 'Resource not found'
      }
    });
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.message
    }
  });
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
