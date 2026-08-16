# ImageKit Integration Guide

## Overview

ImageKit has been integrated into the HomeCare Platform for efficient image management, including upload, storage, transformation, and delivery.

## Installation

ImageKit packages have already been installed:
- **Backend**: `imagekit` (Node.js SDK)
- **Frontend**: `imagekit-javascript` (Browser SDK)

## Environment Variables

### Backend Configuration (.env)

Add these environment variables to your backend `.env` file:

```env
# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint/
```

### Frontend Configuration (.env.local)

Add these environment variables to your frontend `.env.local` file:

```env
# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key_here
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint/
NEXT_PUBLIC_API_URL=http://localhost:3000  # or your actual backend URL
```

## Getting ImageKit Credentials

1. Go to [ImageKit Dashboard](https://imagekit.io/dashboard)
2. Sign up or log in to your account
3. Create a new project or use existing one
4. Navigate to **Settings** → **API Keys**
5. Copy:
   - **Public Key**
   - **Private Key**
   - **URL Endpoint**

## API Endpoints

All endpoints are prefixed with `/api/imagekit`

### 1. Get Authentication Token (Public)
```
POST /api/imagekit/auth
```
Returns authentication parameters for client-side uploads.

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "...",
    "expire": 1234567890,
    "signature": "..."
  }
}
```

### 2. Upload File (Protected)
```
POST /api/imagekit/upload
Content-Type: multipart/form-data

file: <File>
folder: homecare  // optional, default is 'homecare'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "...",
    "name": "image.jpg",
    "url": "https://ik.imagekit.io/...",
    "thumbnail": "https://ik.imagekit.io/...?tr=...",
    "path": "/homecare/uploads/image.jpg",
    "uploadedAt": "2024-01-01T12:00:00Z"
  }
}
```

### 3. List Files (Protected)
```
GET /api/imagekit/files?folder=homecare&limit=50&skip=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "fileId": "...",
      "name": "image.jpg",
      "url": "...",
      "path": "...",
      "type": "file",
      "size": 12345,
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### 4. Get File Metadata (Protected)
```
GET /api/imagekit/file/:fileId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "...",
    "name": "image.jpg",
    "size": 12345,
    "type": "file",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

### 5. Delete File (Protected)
```
DELETE /api/imagekit/:fileId
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 6. Generate Transformation URL (Protected)
```
POST /api/imagekit/transform
Content-Type: application/json

{
  "path": "/homecare/uploads/image.jpg",
  "transformation": [
    { "height": 300, "width": 300, "crop": "thumb" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://ik.imagekit.io/.../tr:h-300,w-300,c-thumb"
}
```

## Frontend Usage

### Basic Upload (Client-Side)

```javascript
import { uploadFile, validateFile } from '@/lib/imagekit';

async function handleImageUpload(event) {
  const file = event.target.files[0];
  
  // Validate file
  const validation = validateFile(file, {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png']
  });
  
  if (!validation.isValid) {
    console.error(validation.errors);
    return;
  }
  
  try {
    const result = await uploadFile(file, 'estimates');
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

### Server-Side Upload

```javascript
import { uploadFileToServer } from '@/lib/imagekit';

async function handleUpload(file) {
  try {
    const result = await uploadFileToServer(file, 'estimates');
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

### Generate Transformed URLs

```javascript
import { getUrlByType, getTransformedUrl } from '@/lib/imagekit';

// Using predefined types
const thumbnailUrl = getUrlByType('/homecare/uploads/image.jpg', 'thumbnail');
const avatarUrl = getUrlByType('/homecare/uploads/avatar.jpg', 'avatar');
const bannerUrl = getUrlByType('/homecare/uploads/banner.jpg', 'banner');

// Custom transformations
const customUrl = getTransformedUrl('/homecare/uploads/image.jpg', [
  { height: 400, width: 600, crop: 'auto' },
  { quality: 'auto', format: 'auto' }
]);
```

### List Files

```javascript
import { listFiles } from '@/lib/imagekit';

async function loadEstimateImages() {
  try {
    const result = await listFiles('estimates', 50, 0);
    console.log(result);
  } catch (error) {
    console.error('Failed to list files:', error);
  }
}
```

### Delete File

```javascript
import { deleteFile } from '@/lib/imagekit';

async function removeImage(fileId) {
  try {
    await deleteFile(fileId);
    console.log('File deleted');
  } catch (error) {
    console.error('Delete failed:', error);
  }
}
```

## Transformation Options

ImageKit supports various transformations. Common examples:

```javascript
// Resize to thumbnail
[{ height: 300, width: 300, crop: 'thumb' }]

// Optimize format and quality
[{ quality: 'auto', format: 'auto' }]

// Create responsive image
[{ width: 800, dpr: 2 }]

// Apply effects
[{ e_blur: 500 }]  // Blur effect

// Combine multiple transformations
[
  { height: 600, width: 800, crop: 'auto' },
  { quality: 80, format: 'webp' }
]
```

[Full list of transformations →](https://docs.imagekit.io/features/image-transformations)

## Folder Structure

Images are organized as follows:

```
/homecare/
├── estimates/          # Estimate-related images
├── bookings/          # Booking-related images
├── customers/         # Customer avatars/documents
├── employees/         # Employee photos
├── services/          # Service images
└── uploads/           # General uploads
```

## Best Practices

1. **Always validate** files before upload
2. **Use appropriate transformations** for different use cases (thumbnails, avatars, etc.)
3. **Set appropriate folder** during upload to keep files organized
4. **Handle errors gracefully** and provide user feedback
5. **Optimize images** using ImageKit's transformation features
6. **Use responsive images** with appropriate dimensions
7. **Add metadata** to uploaded files for better tracking

## Troubleshooting

### Missing Environment Variables
If you see warnings about missing credentials:
```
ImageKit credentials not configured
```
Ensure `.env` (backend) and `.env.local` (frontend) are properly set with ImageKit credentials.

### Upload Failures
- Check file size (default max is 10MB)
- Verify file type is allowed (JPEG, PNG, WebP by default)
- Ensure authentication token is valid
- Check ImageKit quota and billing status

### Transform URL Issues
- Verify the file path is correct
- Check transformation parameters are valid
- Ensure URL endpoint is correctly configured

## Additional Resources

- [ImageKit Documentation](https://docs.imagekit.io)
- [Image Transformations](https://docs.imagekit.io/features/image-transformations)
- [API Reference](https://docs.imagekit.io/api-reference/upload-file-api)
- [Security](https://docs.imagekit.io/features/security)
