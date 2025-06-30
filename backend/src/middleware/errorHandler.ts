import { Request, Response, NextFunction } from 'express';

// General error handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  // Send a meaningful error response
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message || 'Something went wrong.'
  });
};