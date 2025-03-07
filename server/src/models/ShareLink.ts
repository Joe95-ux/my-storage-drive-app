import mongoose, { Document, Schema } from 'mongoose';

export interface IShareLink extends Document {
  file: mongoose.Types.ObjectId;
  token: string;
  permission: 'view' | 'edit';
  isPublic: boolean;
  createdBy: mongoose.Types.ObjectId;
  expiresAt?: Date;
}

const ShareLinkSchema = new Schema<IShareLink>({
  file: { type: Schema.Types.ObjectId, ref: 'File', required: true },
  token: { type: String, required: true, unique: true },
  permission: { type: String, enum: ['view', 'edit'], default: 'view' },
  isPublic: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<IShareLink>('ShareLink', ShareLinkSchema); 