import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  storageUsed: number;
  storageLimit: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  storageUsed: { type: Number, default: 0 },
  storageLimit: { type: Number, default: 5 * 1024 * 1024 * 1024 }, // 5GB
  avatar: String
}, { timestamps: true });

export default model<IUser>('User', userSchema); 