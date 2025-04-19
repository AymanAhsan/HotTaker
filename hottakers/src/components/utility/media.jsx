import React, { useState, useRef } from 'react';

export function useImageUpload({
minFileSize,
  maxFileSize,
  minDimensions,
  maxDimensions,
  allowedTypes,
  cropDimensions
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setImageError("Please select an image file.");
        return;
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        setImageError(`Only ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(' and ')} files are allowed.`);
        return;
      }

      // Check file size
      if (file.size < minFileSize || file.size > maxFileSize) {
        setImageError(`File size should be between ${minFileSize/1024}KB and ${maxFileSize/1024/1024}MB.`);
        return;
      }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);

        if (img.width < minDimensions.width || img.height < minDimensions.height) {
          setImageError(`Image dimensions should be at least ${minDimensions.width}x${minDimensions.height} pixels.`);
          return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setImageError("");

        // Show cropper if image exceeds max dimensions
        if (maxDimensions && (img.width > maxDimensions.width || img.height > maxDimensions.height)) {
          setShowCropper(true);
        }
      };

      img.onerror = () => {
        setImageError("Error loading image.");
      };

      img.src = URL.createObjectURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current?.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        width: cropDimensions.width,
        height: cropDimensions.height,
      });

      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          if (blob && selectedFile) {
            const newFile = new File([blob], selectedFile.name, {
              type: selectedFile.type
            });
            setSelectedFile(newFile);
            setPreviewUrl(URL.createObjectURL(blob));
            setShowCropper(false);
          }
        });
      }
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageError("");
    setShowCropper(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    selectedFile,
    previewUrl,
    imageError,
    showCropper,
    fileInputRef,
    cropperRef,
    handleFileClick,
    handleFileChange,
    handleCrop,
    setShowCropper,
    resetUpload
  };
}

// eslint-disable-next-line react/prop-types
export function ImageUploadButton({ handleFileClick, fileInputRef, handleFileChange, accept = "image/*", buttonText = "Choose File" }) {
  return (
    <>
      <input
        type="file"
        accept={accept}
        className="d-none"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        className="btn btn-outline-secondary mb-2"
        onClick={handleFileClick}
      >
        {buttonText}
      </button>
    </>
  );
}

export function ImagePreview({ previewUrl, width = "100px", height = "100px", className = "rounded-full" }) {
  if (!previewUrl) return null;

  return (
    <div className="mt-2">
      <img
        src={previewUrl}
        alt="Preview"
        style={{ width, height }}
        className={className}
      />
    </div>
  );
}