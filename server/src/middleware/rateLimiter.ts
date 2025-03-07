import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler';

export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  max: number = 100 // limit each IP to 100 requests per windowMs
) => {
  return rateLimit({
    windowMs,
    max,
    message: 'Too many requests from this IP, please try again later',
    handler: (req, res) => {
      throw new AppError('Rate limit exceeded', 429);
    },
  });
}; 