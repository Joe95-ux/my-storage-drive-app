import UserModel from '../models/User';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';

export class UserService {
  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
  }) {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  static async updateStorage(userId: string, size: number) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.storageUsed + size > user.storageLimit) {
      throw new AppError('Storage limit exceeded', 400);
    }

    user.storageUsed += size;
    await user.save();
    return user;
  }

  static async getStorageStats(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      used: user.storageUsed,
      total: user.storageLimit,
      percentage: (user.storageUsed / user.storageLimit) * 100,
    };
  }
} 