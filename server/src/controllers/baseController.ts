import { Request, Response } from 'express';

interface ValidationError {
  msg: string;
  param: string;
  location: string;
  value: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

export abstract class BaseController {
  protected sendSuccess<T>(res: Response, data: T, message?: string): Response {
    return res.status(200).json({
      success: true,
      data,
      message,
    });
  }

  protected sendError(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: ValidationError[]
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  protected sendCreated<T>(res: Response, data: T, message?: string): Response {
    return res.status(201).json({
      success: true,
      data,
      message,
    });
  }

  protected sendNoContent(res: Response): Response {
    return res.status(204).send();
  }
} 