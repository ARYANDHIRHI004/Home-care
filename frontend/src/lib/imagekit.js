import ImageKit from 'imagekit-javascript';

// Initialize ImageKit on the frontend
let ikInstance = null;

/**
 * Get or initialize ImageKit instance
 */
export const getImageKitInstance = () => {
  if (!ikInstance) {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !urlEndpoint) {
      console.warn(
        'ImageKit credentials not configured. Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT'
      );
    }

    ikInstance = new ImageKit({
      publicKey: publicKey || '',
      urlEndpoint: urlEndpoint || '',
    });
  }

  return ikInstance;
};

/**
 * Upload file to ImageKit (client-side upload)
 * @param {File} file - The file to upload
 * @param {string} folder - Folder path (default: 'homecare')
 * @param {Object} customMetadata - Custom metadata
 * @returns {Promise<Object>} Upload result with file details
 */
export const uploadFile = async (file, folder = 'homecare', customMetadata = {}) => {
  // imagekit-javascript v4 dropped the old "pass authenticationEndpoint and
  // let the SDK fetch it" behavior — upload() now requires token/signature/
  // expire to already be in hand, so we fetch them from the backend ourselves.
  const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imagekit/auth`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!authRes.ok) {
    throw new Error('Failed to get ImageKit upload authentication');
  }
  const { token, signature, expire } = await authRes.json();

  const ik = getImageKitInstance();

  return new Promise((resolve, reject) => {
    ik.upload(
      {
        file,
        fileName: `${Date.now()}-${file.name}`,
        folder: `/homecare/${folder}`,
        tags: ['homecare-platform'],
        useUniqueFileName: true,
        isPrivateFile: false,
        token,
        signature,
        expire,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

/**
 * Upload file to server (server-side upload)
 * @param {File} file - The file to upload
 * @param {string} folder - Folder path
 * @returns {Promise<Object>} Upload response from server
 */
export const uploadFileToServer = async (file, folder = 'homecare') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  // Sessions here are httpOnly cookies (both the customer OTP flow and the
  // admin Better Auth instance), not a bearer token — there is no
  // localStorage 'auth_token' anywhere in this app to read.
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imagekit/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
};

/**
 * Generate transformation URL
 * @param {string} path - File path on ImageKit
 * @param {Array<Object>} transformation - Transformation array
 * @returns {string} Transformed URL
 */
export const getTransformedUrl = (path, transformation = []) => {
  const ik = getImageKitInstance();
  return ik.url({
    path,
    transformation,
  });
};

/**
 * Generate URL for different use cases
 * @param {string} filePath - File path
 * @param {string} type - Type: 'thumbnail', 'preview', 'original', 'optimize'
 * @returns {string} Transformed URL
 */
export const getUrlByType = (filePath, type = 'original') => {
  const transformations = {
    thumbnail: [{ height: 300, width: 300, crop: 'thumb' }],
    preview: [{ height: 600, width: 800, crop: 'auto' }],
    optimize: [{ quality: 'auto', format: 'auto' }],
    avatar: [{ height: 150, width: 150, crop: 'thumb' }],
    banner: [{ height: 400, width: 1200, crop: 'auto' }],
  };

  const transformation = transformations[type] || [];
  return getTransformedUrl(filePath, transformation);
};

/**
 * Get image metadata from server
 * @param {string} fileId - ImageKit file ID
 * @returns {Promise<Object>} File metadata
 */
export const getFileMetadata = async (fileId) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imagekit/file/${fileId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to get file metadata');
  }

  return response.json();
};

/**
 * List files from ImageKit (server-side)
 * @param {string} folder - Folder path
 * @param {number} limit - Number of files to fetch
 * @param {number} skip - Number of files to skip
 * @returns {Promise<Array>} Array of files
 */
export const listFiles = async (folder = 'homecare', limit = 50, skip = 0) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/imagekit/files?folder=${folder}&limit=${limit}&skip=${skip}`,
    { credentials: 'include' }
  );

  if (!response.ok) {
    throw new Error('Failed to list files');
  }

  return response.json();
};

/**
 * Delete file from ImageKit
 * @param {string} fileId - ImageKit file ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteFile = async (fileId) => {
  // Route is DELETE /api/imagekit/:fileId (see imagekit.route.js) — the
  // previous /file/:fileId path 404'd against every real deployment.
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/imagekit/${fileId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete file');
  }

  return response.json();
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  } = options;

  const errors = [];

  if (file.size > maxSize) {
    errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
