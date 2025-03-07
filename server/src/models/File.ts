import mongoose, { Document, Schema } from 'mongoose';

interface SharedUser {
  user: mongoose.Types.ObjectId;
  permission: 'view' | 'edit';
}

export interface IFile extends Document {
  name: string;
  type: string;
  size: number;
  path: string;
  owner: mongoose.Types.ObjectId;
  parent?: mongoose.Types.ObjectId;
  shared: SharedUser[];
  isFolder: boolean;
}

const FileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'File' },
  shared: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    permission: { type: String, enum: ['view', 'edit'] }
  }],
  isFolder: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IFile>('File', FileSchema); 