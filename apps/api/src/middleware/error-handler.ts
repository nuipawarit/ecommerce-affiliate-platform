import type { ErrorRequestHandler } from 'express';
import { MarketplaceError } from '@repo/adapters';
import { Prisma } from '@prisma/client';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('Error:', error);

  if (error instanceof MarketplaceError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'MARKETPLACE_ERROR',
        message: error.message,
        marketplace: error.marketplace
      }
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ERROR',
          message: 'A record with this value already exists',
          field: error.meta?.target
        }
      });
      return;
    }

    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Record not found'
        }
      });
      return;
    }
  }

  if (error.name === 'NotFoundError') {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message || 'Resource not found'
      }
    });
    return;
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
