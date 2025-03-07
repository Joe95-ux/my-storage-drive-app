import { Request, Response } from 'express';
import { bucket } from '../config/storage';
import File from '../models/File';
import User from '../models/User';
import mongoose from 'mongoose';
import archiver from 'archiver';
import { v4 as uuidv4 } from 'uuid';
import ShareLink from '../models/ShareLink';
import { AuthRequest, FileUploadRequest } from '../types';

export const uploadFile = async (req: FileUploadRequest, res: Response) => {
  try {
    const file = req.file;
    const { parentId } = req.body;
    
    if (!file || !req.user) {
      return res.status(400).json({ message: 'No file uploaded or user not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.storageUsed + file.size > user.storageLimit) {
      return res.status(400).json({ message: 'Storage limit exceeded' });
    }

    const blob = bucket.file(`${req.user._id}/${file.originalname}`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', () => {
      res.status(500).json({ message: 'Error uploading file' });
    });

    blobStream.on('finish', async () => {
      const newFile = await File.create({
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        path: blob.name,
        owner: req.user!._id,
        parent: parentId || null
      });

      await User.findByIdAndUpdate(req.user!._id, {
        $inc: { storageUsed: file.size }
      });

      res.status(201).json(newFile);
    });

    blobStream.end(file.buffer);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file' });
  }
};

export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name, parentId } = req.body;

    const folder = await File.create({
      name,
      type: 'folder',
      size: 0,
      path: '',
      owner: req.user?._id,
      parent: parentId || null,
      isFolder: true
    });

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating folder' });
  }
};

export const getFiles = async (req: AuthRequest, res: Response) => {
  try {
    const { folderId } = req.query;
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const files = await File.find({
      owner: req.user._id,
      parent: folderId || null
    }).sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user?._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (!file.isFolder) {
      await bucket.file(file.path).delete();
      
      // Update user's storage used
      await User.findByIdAndUpdate(req.user?._id, {
        $inc: { storageUsed: -file.size }
      });
    }

    await file.deleteOne();
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file' });
  }
};

export const generateShareLink = async (req: Request, res: Response) => {
  try {
    const { permission, isPublic } = req.body;
    const fileId = req.params.id;

    const file = await File.findOne({
      _id: fileId,
      owner: req.user?._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const shareLink = await ShareLink.create({
      file: fileId,
      token: uuidv4(),
      permission,
      isPublic,
      createdBy: req.user?._id
    });

    const fullShareLink = `${process.env.CLIENT_URL}/share/${shareLink.token}`;
    res.json({ shareLink: fullShareLink });
  } catch (error) {
    res.status(500).json({ message: 'Error generating share link' });
  }
};

export const shareFile = async (req: Request, res: Response) => {
  try {
    const { email, permission } = req.body;
    const fileId = req.params.id;

    const file = await File.findOne({
      _id: fileId,
      owner: req.user?._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    file.shared.push({
      user: user._id,
      permission
    });

    await file.save();
    res.json({ message: 'File shared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing file' });
  }
};

export const bulkDelete = async (req: Request, res: Response) => {
  try {
    const { fileIds } = req.body;

    const files = await File.find({
      _id: { $in: fileIds },
      owner: req.user?._id
    });

    // Delete from storage
    for (const file of files) {
      if (!file.isFolder) {
        await bucket.file(file.path).delete();
      }
    }

    // Update user's storage usage
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    await User.findByIdAndUpdate(req.user?._id, {
      $inc: { storageUsed: -totalSize }
    });

    // Delete from database
    await File.deleteMany({
      _id: { $in: fileIds },
      owner: req.user?._id
    });

    res.json({ message: 'Files deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting files' });
  }
};

export const bulkDownload = async (req: Request, res: Response) => {
  try {
    const { fileIds } = req.body;

    const files = await File.find({
      _id: { $in: fileIds },
      owner: req.user?._id
    });

    // Create a zip file
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    res.attachment('files.zip');
    archive.pipe(res);

    // Add files to the zip
    for (const file of files) {
      if (!file.isFolder) {
        const fileStream = bucket.file(file.path).createReadStream();
        archive.append(fileStream, { name: file.name });
      }
    }

    await archive.finalize();
  } catch (error) {
    res.status(500).json({ message: 'Error downloading files' });
  }
}; 