import imagekit from '../config/imagekit.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Get ImageKit authentication token for client-side uploads
 * @route POST /api/imagekit/auth
 */
export const getImageKitAuthToken = async (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();

    // The ImageKit client SDK expects { token, expire, signature } directly at the root
    res.status(200).json(result);
  } catch (error) {
    console.error('ImageKit Auth Token Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authentication token',
      error: error.message,
    });
  }
};

/**
 * Upload file to ImageKit (server-side)
 * @route POST /api/imagekit/upload
 */
export const uploadToImageKit = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      });
    }

    const { folder = 'homecare' } = req.body;

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: `/homecare/${folder}`,
      tags: ['homecare-platform'],
      customMetadata: {
        uploadedBy: req.user?.id || 'anonymous',
        uploadedAt: new Date().toISOString(),
      },
    });

    res.status(200).json({
      success: true,
      data: {
        fileId: result.fileId,
        name: result.name,
        url: result.url,
        thumbnail: result.thumbnail,
        path: result.filePath,
        uploadedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('ImageKit Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file to ImageKit',
      error: error.message,
    });
  }
};

/**
 * Delete file from ImageKit
 * @route DELETE /api/imagekit/:fileId
 */
export const deleteFromImageKit = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required',
      });
    }

    await imagekit.deleteFile(fileId);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('ImageKit Delete Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file from ImageKit',
      error: error.message,
    });
  }
};

/**
 * List files from a specific folder
 * @route GET /api/imagekit/files?folder=:folder
 */
export const listImageKitFiles = async (req, res) => {
  try {
    const { folder = 'homecare', limit = 50, skip = 0 } = req.query;

    const result = await imagekit.listFiles({
      path: `/homecare/${folder}`,
      limit: parseInt(limit),
      skip: parseInt(skip),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('ImageKit List Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list files from ImageKit',
      error: error.message,
    });
  }
};

/**
 * Get file metadata
 * @route GET /api/imagekit/file/:fileId
 */
export const getImageKitFileMetadata = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required',
      });
    }

    const result = await imagekit.getFileDetails(fileId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('ImageKit Metadata Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get file metadata',
      error: error.message,
    });
  }
};

/**
 * Generate image transformation URL
 * @route POST /api/imagekit/transform
 */
export const generateTransformURL = async (req, res) => {
  try {
    const { path: filePath, transformation } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'File path is required',
      });
    }

    const url = imagekit.url({
      path: filePath,
      transformation: transformation || [],
    });

    res.status(200).json({
      success: true,
      url,
    });
  } catch (error) {
    console.error('ImageKit Transform Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate transformation URL',
      error: error.message,
    });
  }
};
