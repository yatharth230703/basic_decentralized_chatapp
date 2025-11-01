import React, { useState, useEffect } from 'react';
import gun from '../config/gunConfig';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chatroom = gun.get('chatroom').get('images');
    const imagesMap = {};

    chatroom.map().on((data, key) => {
      if (data && data.base64Data && data.id) {
        imagesMap[key] = data;
        const imagesArray = Object.values(imagesMap)
          .filter((img) => img.base64Data)
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setImages(imagesArray);
        setLoading(false);
      }
    });

    return () => {
      chatroom.off();
    };
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading && images.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
          <p>No images shared yet.</p>
          <p className="text-sm mt-2">Upload images from the chatroom to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition group"
              onClick={() => setSelectedImage(img)}
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src={img.base64Data}
                  alt={img.fileName || 'Shared image'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 bg-white">
                <p className="text-xs font-semibold text-text truncate">
                  {img.uploader || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTime(img.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <img
                src={selectedImage.base64Data}
                alt={selectedImage.fileName || 'Shared image'}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
              <p className="font-semibold text-text">
                {selectedImage.uploader || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatTime(selectedImage.timestamp)}
              </p>
              {selectedImage.fileName && (
                <p className="text-xs text-gray-400 mt-1">
                  {selectedImage.fileName}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;

