import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';
import { IUser } from '../models/User';

export const generateToken = (user: IUser) => {
  if (!authConfig.jwt.secret) {
    throw new Error('JWT secret is not defined');
  }
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role 
    },
    authConfig.jwt.secret,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, authConfig.jwt.secret);
  } catch (error) {
    return null;
  }
}; 