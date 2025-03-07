import { Storage } from '@google-cloud/storage';
import FileModel from '../models/File';
import { AppError } from '../middleware/errorHandler';
import { bucket } from '../config/storage';

export class FileService {
  static async uploadFile(
    file: Express.Multer.File,
    userId: string,
    parentId?: string
  ) {
    const blob = bucket.file(`${userId}/${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));
      blobStream.on('finish', async () => {
        try {
          const newFile = await FileModel.create({
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            path: blob.name,
            owner: userId,
            parent: parentId,
          });
          resolve(newFile);
        } catch (error) {
          reject(error);
        }
      });
      blobStream.end(file.buffer);
    });
  }

  static async deleteFile(fileId: string, userId: string) {
    const file = await FileModel.findOne({ _id: fileId, owner: userId });
    if (!file) {
      throw new AppError('File not found', 404);
    }

    if (!file.isFolder) {
      await bucket.file(file.path).delete().catch(() => {});
    }

    await file.deleteOne();
    return true;
  }

  static async getSignedUrl(filePath: string, expires: number = 3600) {
    const [url] = await bucket.file(filePath).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expires * 1000,
    });
    return url;
  }
} 