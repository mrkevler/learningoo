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
  aspectRatio?: number; // width/height ratio
  showAspectRatioSelector?: boolean;
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

interface AspectRatioState {
  selectedRatio: number;
  showSelector: boolean;
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
  aspectRatio,
  showAspectRatioSelector = false,
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
  const [aspectRatioState, setAspectRatioState] = useState<AspectRatioState>({
    selectedRatio: aspectRatio || 16 / 9,
    showSelector: showAspectRatioSelector,
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
            border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all
            ${
              dragActive
                ? "border-brand bg-brand/5"
                : "border-gray-300 dark:border-gray-600 hover:border-brand"
            }
            ${uploadProgress.uploading ? "pointer-events-none opacity-50" : ""}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
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
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1">
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

      {/* Aspect Ratio Selector for lesson images */}
      {type === "lesson-image" && aspectRatioState.showSelector && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
            Choose Image Aspect Ratio:
          </h4>
          <div className="flex gap-3">
            {[
              { ratio: 1, label: "1:1 Square" },
              { ratio: 4 / 3, label: "4:3 Standard" },
              { ratio: 16 / 9, label: "16:9 Widescreen" },
            ].map(({ ratio, label }) => (
              <button
                key={ratio}
                type="button"
                onClick={() =>
                  setAspectRatioState((prev) => ({
                    ...prev,
                    selectedRatio: ratio,
                  }))
                }
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  aspectRatioState.selectedRatio === ratio
                    ? "bg-brand text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded">
            <div
              className="bg-gray-200 dark:bg-gray-700 rounded mx-auto"
              style={{
                width: "120px",
                height: `${120 / aspectRatioState.selectedRatio}px`,
              }}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Preview: {aspectRatioState.selectedRatio.toFixed(2)}:1 ratio
            </p>
          </div>
        </div>
      )}

      {/* Crop Editor Modal */}
      {cropState.showCropEditor && cropState.tempImageUrl && (
        <ImageCropEditor
          imageUrl={cropState.tempImageUrl}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
          aspectRatio={
            type === "lesson-image" ? aspectRatioState.selectedRatio : 16 / 9
          }
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
  aspectRatio?: number;
}

export const LessonImageUpload: React.FC<LessonImageUploadProps> = ({
  currentImage,
  onUploadSuccess,
  onUploadError,
  aspectRatio = 16 / 9,
}) => {
  const [selectedRatio, setSelectedRatio] = useState(aspectRatio);

  return (
    <div className="space-y-4">
      {/* Aspect Ratio Selector */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
          Image Aspect Ratio:
        </h4>
        <div className="flex gap-2 mb-3">
          {[
            { ratio: 1, label: "1:1", desc: "Square" },
            { ratio: 4 / 3, label: "4:3", desc: "Standard" },
            { ratio: 16 / 9, label: "16:9", desc: "Widescreen" },
          ].map(({ ratio, label, desc }) => (
            <button
              key={ratio}
              type="button"
              onClick={() => setSelectedRatio(ratio)}
              className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                selectedRatio === ratio
                  ? "bg-brand text-white shadow-md scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <div>{label}</div>
              <div className="text-xs opacity-75">{desc}</div>
            </button>
          ))}
        </div>

        {/* Aspect ratio preview */}
        <div className="p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-800">
          <div
            className="bg-gray-300 dark:bg-gray-600 rounded mx-auto shadow-inner"
            style={{
              width: "100px",
              height: `${100 / selectedRatio}px`,
            }}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Preview: {selectedRatio.toFixed(2)}:1 ratio
          </p>
        </div>
      </div>

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
        // Show upload area
        <ImageUpload
          type="lesson-image"
          aspectRatio={selectedRatio}
          showAspectRatioSelector={false}
          onUploadStart={(tempUrl) => onUploadSuccess(tempUrl)}
          onUploadSuccess={(urls) => onUploadSuccess(urls[0])}
          onUploadError={onUploadError}
        />
      )}
    </div>
  );
};
