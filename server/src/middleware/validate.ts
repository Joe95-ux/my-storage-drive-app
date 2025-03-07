import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { ValidationChain } from 'express-validator/src/chain';
import { validationResult } from 'express-validator/src/validation-result';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    throw new AppError('Validation Error', 400, errors.array());
  };
}; 