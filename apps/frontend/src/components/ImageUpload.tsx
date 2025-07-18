import React, { useState, useRef } from "react";
import { api } from "../services/api";
import { ImageCropEditor } from "./ImageCropEditor";

interface ImageUploadProps {
  type:
    | "course-cover"
    | "chapter-cover"
    | "course-photos"
    | "lesson-image"
    | "profile-photo";
  onUploadSuccess: (
    urls: string[],
    thumbnails?: Record<string, string>
  ) => void;
  onUploadError?: (error: string) => void;
  onUploadStart?: (tempUrl: string) => void;
  currentImage?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  children?: React.ReactNode;
}

interface UploadProgress {
  uploading: boolean;
  progress: number;
  error?: string;
}

interface CropState {
  showCropEditor: boolean;
  tempImageUrl: string | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  type,
  onUploadSuccess,
  onUploadError,
  onUploadStart,
  currentImage,
  multiple = false,
  maxFiles = 1,
  className = "",
  children,
}) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    uploading: false,
    progress: 0,
  });
  const [dragActive, setDragActive] = useState(false);
  const [cropState, setCropState] = useState<CropState>({
    showCropEditor: false,
    tempImageUrl: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    // Validate file count
    if (files.length > maxFiles) {
      const error = `Maximum ${maxFiles} file(s) allowed`;
      setUploadProgress({ uploading: false, progress: 0, error });
      onUploadError?.(error);
      return;
    }

    // Validate file types and sizes
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validTypes.includes(file.type)) {
        const error = `Invalid file type: ${file.name}. Only JPEG, PNG, and WebP are allowed.`;
        setUploadProgress({ uploading: false, progress: 0, error });
        onUploadError?.(error);
        return;
      }
      if (file.size > maxSize) {
        const error = `File too large: ${file.name}. Maximum size is 10MB.`;
        setUploadProgress({ uploading: false, progress: 0, error });
        onUploadError?.(error);
        return;
      }
    }

    // Handle images that need crop editor - open crop editor
    if ((type === "course-cover" || type === "lesson-image") && !multiple) {
      const file = files[0];
      const tempUrl = URL.createObjectURL(file);
      setCropState({
        showCropEditor: true,
        tempImageUrl: tempUrl,
      });
      return;
    }

    setUploadProgress({ uploading: true, progress: 0 });

    try {
      const formData = new FormData();

      if (multiple) {
        Array.from(files).forEach((file) => {
          formData.append("images", file);
        });
      } else {
        formData.append("image", files[0]);
      }

      // Determine endpoint based on type
      const endpoint = `/upload/${type}`;

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress((prev) => ({ ...prev, progress }));
          }
        },
      });

      setUploadProgress({ uploading: false, progress: 100 });

      if (response.data.success) {
        const urls = Array.isArray(response.data.urls)
          ? response.data.urls
          : [response.data.url];

        onUploadSuccess(urls, response.data.thumbnails);
      } else {
        throw new Error(response.data.error || "Upload failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Upload failed";
      setUploadProgress({ uploading: false, progress: 0, error: errorMessage });
      onUploadError?.(errorMessage);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (uploadProgress.uploading) return;

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleClick = () => {
    if (!uploadProgress.uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!uploadProgress.uploading) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleCropSave = async (croppedImageBlob: Blob) => {
    // Create temporary URL for the cropped blob to prevent validation errors
    const tempCroppedUrl = URL.createObjectURL(croppedImageBlob);

    // Close modal immediately and set temporary URL
    const tempUrlToCleanup = cropState.tempImageUrl;
    setCropState({ showCropEditor: false, tempImageUrl: null });

    // Clean up original temp URL
    if (tempUrlToCleanup) {
      URL.revokeObjectURL(tempUrlToCleanup);
    }

    // Notify parent with temporary URL to prevent validation errors
    if (onUploadStart) {
      onUploadStart(tempCroppedUrl);
    }

    // Start upload process in background
    setUploadProgress({ uploading: true, progress: 0 });

    try {
      const formData = new FormData();
      formData.append("image", croppedImageBlob, "cropped-cover.jpg");

      const response = await api.post(`/upload/${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress((prev) => ({ ...prev, progress }));
          }
        },
      });

      setUploadProgress({ uploading: false, progress: 100 });

      if (response.data.success) {
        const urls = Array.isArray(response.data.urls)
          ? response.data.urls
          : [response.data.url];

        onUploadSuccess(urls, response.data.thumbnails);
      } else {
        throw new Error(response.data.error || "Upload failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Upload failed";
      setUploadProgress({ uploading: false, progress: 0, error: errorMessage });
      onUploadError?.(errorMessage);
    } finally {
      // Clean up temporary cropped URL
      if (tempCroppedUrl) {
        URL.revokeObjectURL(tempCroppedUrl);
      }
    }
  };

  const handleCropCancel = () => {
    if (cropState.tempImageUrl) {
      URL.revokeObjectURL(cropState.tempImageUrl);
    }
    setCropState({ showCropEditor: false, tempImageUrl: null });
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200
            ${
              dragActive
                ? "border-brand bg-brand/5 shadow-lg shadow-brand/20"
                : "border-gray-300 dark:border-gray-600 hover:border-brand hover:bg-brand/5 hover:shadow-lg hover:shadow-brand/10"
            }
            ${uploadProgress.uploading ? "pointer-events-none opacity-50" : ""}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          data-upload-clickable="true"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploadProgress.uploading ? (
            <div className="text-center">
              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.progress}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uploading... {uploadProgress.progress}%
              </p>
            </div>
          ) : (
            <>
              {children || (
                <div className="text-center group">
                  <div className="mb-4 transition-all duration-200 group-hover:scale-110">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 group-hover:text-brand transition-colors duration-200 group-hover:drop-shadow-lg"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      style={{
                        filter: "brightness(1) contrast(1)",
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-brand transition-colors duration-200">
                    <p className="font-medium group-hover:font-semibold transition-all duration-200">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200">
                      JPEG, PNG, WebP up to 10MB
                      {multiple && ` (max ${maxFiles} files)`}
                      {(type === "course-cover" || type === "lesson-image") &&
                        " - with crop editor"}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {uploadProgress.error && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">
            {uploadProgress.error}
          </div>
        )}

        {currentImage && !uploadProgress.uploading && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Current image:
            </p>
            <img
              src={currentImage}
              alt="Current"
              className="h-32 w-32 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      {/* Crop Editor Modal */}
      {cropState.showCropEditor && cropState.tempImageUrl && (
        <ImageCropEditor
          imageUrl={cropState.tempImageUrl}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
          initialAspectRatio={16 / 9}
          allowAspectRatioChange={type === "lesson-image"}
          mode={type === "course-cover" ? "course-cover" : "lesson-image"}
        />
      )}
    </>
  );
};

// Enhanced component specifically for lesson image blocks
interface LessonImageUploadProps {
  currentImage?: string;
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export const LessonImageUpload: React.FC<LessonImageUploadProps> = ({
  currentImage,
  onUploadSuccess,
  onUploadError,
}) => {
  return (
    <div className="space-y-4">
      {/* Image Upload Area */}
      {currentImage ? (
        // Show uploaded image with delete button (consistent with course pages)
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex justify-center bg-gray-50 dark:bg-gray-900">
          <div className="relative inline-block">
            <img
              src={currentImage}
              alt="Lesson Image"
              className="h-32 w-32 object-cover rounded-lg shadow-md"
            />
            <button
              type="button"
              onClick={() => onUploadSuccess("")}
              className="absolute -top-1 -right-1 bg-gray-100 bg-opacity-30 text-gray-800 dark:text-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-opacity-25 shadow-lg"
              title="Remove image"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        // Show upload area with crop editor integration
        <ImageUpload
          type="lesson-image"
          onUploadStart={(tempUrl) => onUploadSuccess(tempUrl)}
          onUploadSuccess={(urls) => onUploadSuccess(urls[0])}
          onUploadError={onUploadError}
        />
      )}
    </div>
  );
};
