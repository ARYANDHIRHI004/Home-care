import { Router } from 'express';
import multer from 'multer';
import * as imagekitController from '../controllers/imagekit.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Buffered in memory, not disk — files are relayed straight to ImageKit and
// never need to touch this server's filesystem.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Public routes (no auth required for some)
router.post('/auth', imagekitController.getImageKitAuthToken);

// Protected routes (auth required)
router.use(requireAuth);

// Upload file to ImageKit
router.post('/upload', upload.single('file'), imagekitController.uploadToImageKit);

// List files from ImageKit
router.get('/files', imagekitController.listImageKitFiles);

// Get file metadata
router.get('/file/:fileId', imagekitController.getImageKitFileMetadata);

// Generate transformation URL
router.post('/transform', imagekitController.generateTransformURL);

// Delete file from ImageKit
router.delete('/:fileId', imagekitController.deleteFromImageKit);

export default router;
