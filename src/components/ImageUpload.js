import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import gun from '../config/gunConfig';
import { v4 as uuidv4 } from 'uuid';
import { compressImageToBase64, isValidImageFile } from '../utils/imageUtils';

const ImageUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setError('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const base64Data = await compressImageToBase64(file);
      const imageId = uuidv4();
      const chatroom = gun.get('chatroom').get('images').get(imageId);

      await new Promise((resolve) => {
        chatroom.put({
          id: imageId,
          uploader: user.displayName || user.email,
          userId: user.uid,
          base64Data,
          fileName: file.name,
          timestamp: Date.now(),
        }, resolve);
      });

      // Show success message
      setError(null);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="px-4 py-2 border-t border-gray-200 bg-secondary">
      {error && (
        <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <div className="flex items-center gap-2">
        <label
          className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm text-text font-medium">
            {uploading ? 'Uploading...' : 'Upload Image'}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {uploading && (
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

