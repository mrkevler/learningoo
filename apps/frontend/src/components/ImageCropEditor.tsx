import React, { useState, useRef, useEffect, useCallback } from "react";

interface ImageCropEditorProps {
  imageUrl: string;
  onSave: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
  initialAspectRatio?: number; // width/height ratio - default 16:9
  allowAspectRatioChange?: boolean; // Allow user to change aspect ratio
  mode?: "course-cover" | "lesson-image"; // Determines available ratios and UI
}

interface ImageState {
  scale: number;
  x: number;
  y: number;
}

interface AspectRatioOption {
  ratio: number;
  label: string;
  description: string;
}

export const ImageCropEditor: React.FC<ImageCropEditorProps> = ({
  imageUrl,
  onSave,
  onCancel,
  initialAspectRatio = 16 / 9,
  allowAspectRatioChange = false,
  mode = "course-cover",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageState, setImageState] = useState<ImageState>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const [currentAspectRatio, setCurrentAspectRatio] =
    useState(initialAspectRatio);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Define available aspect ratios based on mode
  const getAspectRatioOptions = (): AspectRatioOption[] => {
    if (mode === "course-cover") {
      return [{ ratio: 16 / 9, label: "16:9", description: "Widescreen" }];
    }
    return [
      { ratio: 1, label: "1:1", description: "Square" },
      { ratio: 4 / 3, label: "4:3", description: "Standard" },
      { ratio: 16 / 9, label: "16:9", description: "Widescreen" },
    ];
  };

  const aspectRatioOptions = getAspectRatioOptions();

  // Dynamic canvas dimensions based on current aspect ratio
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = CANVAS_WIDTH / currentAspectRatio;
  const PREVIEW_WIDTH = 400;
  const PREVIEW_HEIGHT = PREVIEW_WIDTH / currentAspectRatio;

  // Recalculate image position when aspect ratio changes
  const recalculateImageState = useCallback(
    (newAspectRatio: number) => {
      if (!image) return;

      const newCanvasHeight = CANVAS_WIDTH / newAspectRatio;
      const scaleX = CANVAS_WIDTH / image.width;
      const scaleY = newCanvasHeight / image.height;
      const initialScale = Math.max(scaleX, scaleY);

      setImageState({
        scale: initialScale,
        x: (CANVAS_WIDTH - image.width * initialScale) / 2,
        y: (newCanvasHeight - image.height * initialScale) / 2,
      });
    },
    [image, CANVAS_WIDTH]
  );

  // Handle aspect ratio change
  const handleAspectRatioChange = (newRatio: number) => {
    setCurrentAspectRatio(newRatio);
    recalculateImageState(newRatio);
  };

  // Load and initialize image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImage(img);
      setImageLoaded(true);

      // Calculate initial scale to fit image in canvas
      const scaleX = CANVAS_WIDTH / img.width;
      const scaleY = CANVAS_HEIGHT / img.height;
      const initialScale = Math.max(scaleX, scaleY);

      setImageState({
        scale: initialScale,
        x: (CANVAS_WIDTH - img.width * initialScale) / 2,
        y: (CANVAS_HEIGHT - img.height * initialScale) / 2,
      });
    };
    img.src = imageUrl;
  }, [imageUrl, CANVAS_WIDTH, CANVAS_HEIGHT]);

  // Draw image on canvas
  const drawImage = useCallback(() => {
    if (!image || !canvasRef.current || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Update canvas dimensions
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw image with current transform
    ctx.save();
    ctx.drawImage(
      image,
      imageState.x,
      imageState.y,
      image.width * imageState.scale,
      image.height * imageState.scale
    );
    ctx.restore();

    // Draw crop overlay
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.restore();

    // Draw crop border
    ctx.save();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.restore();

    // Update preview
    updatePreview();
  }, [imageState, imageLoaded, image, CANVAS_WIDTH, CANVAS_HEIGHT]);

  // Update preview canvas
  const updatePreview = useCallback(() => {
    if (!image || !previewCanvasRef.current || !imageLoaded) return;

    const previewCanvas = previewCanvasRef.current;
    const previewCtx = previewCanvas.getContext("2d");
    if (!previewCtx) return;

    // Update preview canvas dimensions
    previewCanvas.width = PREVIEW_WIDTH;
    previewCanvas.height = PREVIEW_HEIGHT;

    previewCtx.clearRect(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);

    // Calculate source coordinates for cropping
    const sourceX = Math.max(0, -imageState.x / imageState.scale);
    const sourceY = Math.max(0, -imageState.y / imageState.scale);
    const sourceWidth = Math.min(
      image.width - sourceX,
      CANVAS_WIDTH / imageState.scale
    );
    const sourceHeight = Math.min(
      image.height - sourceY,
      CANVAS_HEIGHT / imageState.scale
    );

    previewCtx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      PREVIEW_WIDTH,
      PREVIEW_HEIGHT
    );
  }, [imageState, imageLoaded, image, PREVIEW_WIDTH, PREVIEW_HEIGHT]);

  // Redraw when image state or aspect ratio changes
  useEffect(() => {
    drawImage();
  }, [drawImage]);

  // Mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imageState.x,
      y: e.clientY - imageState.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setImageState((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoom = (direction: "in" | "out") => {
    const zoomFactor = direction === "in" ? 1.1 : 0.9;
    setImageState((prev) => ({
      ...prev,
      scale: Math.max(0.1, Math.min(5, prev.scale * zoomFactor)),
    }));
  };

  // Reset to initial state
  const handleReset = () => {
    recalculateImageState(currentAspectRatio);
  };

  // Save cropped image
  const handleSave = async () => {
    if (!image || !imageLoaded) return;

    // Create a new canvas for the final cropped image
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = CANVAS_WIDTH;
    finalCanvas.height = CANVAS_HEIGHT;
    const finalCtx = finalCanvas.getContext("2d");

    if (!finalCtx) return;

    // Calculate source coordinates for cropping
    const sourceX = Math.max(0, -imageState.x / imageState.scale);
    const sourceY = Math.max(0, -imageState.y / imageState.scale);
    const sourceWidth = Math.min(
      image.width - sourceX,
      CANVAS_WIDTH / imageState.scale
    );
    const sourceHeight = Math.min(
      image.height - sourceY,
      CANVAS_HEIGHT / imageState.scale
    );

    // Draw the cropped image
    finalCtx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );

    // Convert to blob
    finalCanvas.toBlob(
      (blob) => {
        if (blob) {
          onSave(blob);
        }
      },
      "image/jpeg",
      0.9
    );
  };

  if (!imageLoaded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200">Loading image...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-7xl w-full max-h-[95vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {mode === "course-cover" ? "Edit Cover Photo" : "Edit Lesson Image"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Main editing area */}
          <div className="flex-1">
            {/* Compact Aspect Ratio Selector */}
            {allowAspectRatioChange && aspectRatioOptions.length > 1 && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-4 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Aspect Ratio:
                  </span>
                  {aspectRatioOptions.map(({ ratio, label, description }) => (
                    <button
                      key={ratio}
                      onClick={() => handleAspectRatioChange(ratio)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                        currentAspectRatio === ratio
                          ? "bg-brand text-white shadow-md"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    Current: {currentAspectRatio.toFixed(2)}:1
                  </span>
                </div>
              </div>
            )}

            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div
                ref={containerRef}
                className="relative mx-auto border-2 border-dashed border-gray-400 cursor-move"
                style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="absolute inset-0"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleZoom("out")}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Zoom Out
              </button>
              <button
                onClick={() => handleZoom("in")}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Zoom In
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Reset Position
              </button>
            </div>
          </div>

          {/* Preview and actions */}
          <div className="xl:w-96">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Preview
              </h3>
              <div className="border border-gray-300 dark:border-gray-600 rounded">
                <canvas
                  ref={previewCanvasRef}
                  width={PREVIEW_WIDTH}
                  height={PREVIEW_HEIGHT}
                  className="w-full h-auto rounded"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Final Aspect Ratio: {currentAspectRatio.toFixed(2)}:1
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSave}
                className="w-full bg-brand text-white py-3 px-4 rounded-lg hover:bg-brand-dark font-semibold transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={onCancel}
                className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Drag the image to reposition</li>
                <li>Use zoom buttons to scale</li>
                <li>The dashed border shows crop area</li>
                <li>Preview shows final result</li>
                {allowAspectRatioChange && <li>Choose aspect ratio above</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
