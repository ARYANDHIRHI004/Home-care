'use client';

import React, { useState, useRef } from 'react';
import { uploadFile, validateFile, getUrlByType } from '@/lib/imagekit';
import { Upload, X } from 'lucide-react';

/**
 * Example ImageKit Upload Component
 * Demonstrates client-side file upload to ImageKit
 */
export default function ImageKitUploadExample() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file, {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    setError('');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const result = await uploadFile(selectedFile, 'estimates', {
        description: 'Example upload',
      });

      setUploadedImage(result);
      setSelectedFile(null);
      setPreviewUrl('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-6">ImageKit Upload Example</h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Upload Area */}
      {!uploadedImage ? (
        <>
          <div
            className="mb-4 p-8 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50 cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-blue-500" />
              <p className="text-sm font-medium text-gray-700">Click to upload image</p>
              <p className="text-xs text-gray-500">Max 5MB • JPEG, PNG, WebP</p>
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            {selectedFile && (
              <button
                onClick={handleClear}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Success State */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Image:</p>

            {/* Original Image */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Original:</p>
              <img
                src={uploadedImage.url}
                alt={uploadedImage.name}
                className="w-full rounded-lg border border-gray-200"
              />
            </div>

            {/* Thumbnail Version */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Thumbnail (300x300):</p>
              <img
                src={getUrlByType(uploadedImage.path, 'thumbnail')}
                alt={`${uploadedImage.name} - Thumbnail`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
            </div>

            {/* File Details */}
            <div className="mb-4 p-3 bg-gray-50 rounded text-xs space-y-1">
              <p>
                <span className="font-medium text-gray-700">File ID:</span> {uploadedImage.fileId}
              </p>
              <p>
                <span className="font-medium text-gray-700">Name:</span> {uploadedImage.name}
              </p>
              <p>
                <span className="font-medium text-gray-700">Path:</span> {uploadedImage.path}
              </p>
              <p>
                <span className="font-medium text-gray-700">Uploaded:</span>{' '}
                {new Date(uploadedImage.uploadedAt).toLocaleString()}
              </p>
            </div>

            {/* URL Display */}
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs font-mono break-all">
              {uploadedImage.url}
            </div>
          </div>

          {/* Upload Another */}
          <button
            onClick={() => {
              setUploadedImage(null);
              setPreviewUrl('');
              setSelectedFile(null);
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Another Image
          </button>
        </>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded text-xs text-gray-600">
        <p className="font-medium text-gray-700 mb-2">Usage in your components:</p>
        <code className="block bg-white p-2 rounded border border-gray-200 overflow-auto">
          {`import { uploadFile } from '@/lib/imagekit';\n\nconst result = await uploadFile(file, 'folder');`}
        </code>
      </div>
    </div>
  );
}
