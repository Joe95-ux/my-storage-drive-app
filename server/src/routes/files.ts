import express, { RequestHandler } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';
import {
  uploadFile,
  createFolder,
  getFiles,
  deleteFile,
  shareFile,
  generateShareLink,
  bulkDelete,
  bulkDownload
} from '../controllers/fileController';
import { searchFiles } from '../controllers/searchController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', requireAuth as RequestHandler, upload.single('file'), uploadFile as RequestHandler);
router.post('/folder', requireAuth as RequestHandler, createFolder as RequestHandler);
router.get('/', requireAuth as RequestHandler, getFiles as RequestHandler);
router.delete('/:id', requireAuth as RequestHandler, deleteFile as RequestHandler);
router.post('/:id/share/link', requireAuth as RequestHandler, generateShareLink as RequestHandler);
router.post('/:id/share/user', requireAuth as RequestHandler, shareFile as RequestHandler);
router.post('/bulk-delete', requireAuth as RequestHandler, bulkDelete as RequestHandler);
router.post('/bulk-download', requireAuth as RequestHandler, bulkDownload as RequestHandler);
router.get('/search', requireAuth as RequestHandler, searchFiles as RequestHandler);

export default router;