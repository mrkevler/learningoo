import { Request, Response } from "express";
import multer from "multer";
import { UploadService } from "../utils/uploadService";
import { ImageProcessor } from "../utils/imageProcessor";
import { asyncHandler } from "../utils/asyncHandler";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5, // Maximum 5 files at once
  },
  fileFilter: (req, file, cb) => {
    const validation = ImageProcessor.validateImage(file as any);
    if (validation.valid) {
      cb(null, true);
    } else {
      cb(new Error(validation.error || "Invalid file"));
    }
  },
});

/**
 * Upload course cover image
 * POST /api/upload/course-cover
 */
export const uploadCourseCover = [
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const result = await UploadService.uploadImage(req.file.buffer, {
      type: "courseCover",
      originalName: req.file.originalname,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      success: true,
      url: result.urls[0],
      fileSize: result.fileSize,
    });
  }),
];

/**
 * Upload chapter cover image
 * POST /api/upload/chapter-cover
 */
export const uploadChapterCover = [
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const result = await UploadService.uploadImage(req.file.buffer, {
      type: "chapterCover",
      originalName: req.file.originalname,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      success: true,
      url: result.urls[0],
      fileSize: result.fileSize,
    });
  }),
];

/**
 * Upload course photos (gallery)
 * POST /api/upload/course-photos
 */
export const uploadCoursePhotos = [
  upload.array("images", 5), // Max 5 photos
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    // Validate all files
    const validation = UploadService.validateFiles(files);
    if (!validation.valid) {
      return res.status(400).json({
        error: "File validation failed",
        details: validation.errors,
      });
    }

    // Upload all files
    const uploadPromises = files.map((file) =>
      UploadService.uploadImage(file.buffer, {
        type: "coursePhoto",
        originalName: file.originalname,
      })
    );

    const results = await Promise.all(uploadPromises);

    // Check for failures
    const failed = results.filter((r) => !r.success);
    if (failed.length > 0) {
      return res.status(500).json({
        error: "Some uploads failed",
        failed: failed.map((f) => f.error),
      });
    }

    res.json({
      success: true,
      urls: results.map((r) => r.urls[0]),
      totalSize: results.reduce((sum, r) => sum + (r.fileSize || 0), 0),
    });
  }),
];

/**
 * Upload lesson image
 * POST /api/upload/lesson-image
 */
export const uploadLessonImage = [
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const result = await UploadService.uploadImage(req.file.buffer, {
      type: "lessonImage",
      originalName: req.file.originalname,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      success: true,
      url: result.urls[0],
      fileSize: result.fileSize,
    });
  }),
];

/**
 * Upload profile photo
 * POST /api/upload/profile-photo
 */
export const uploadProfilePhoto = [
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const result = await UploadService.uploadImage(req.file.buffer, {
      type: "profilePhoto",
      originalName: req.file.originalname,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      success: true,
      url: result.urls[0],
      thumbnails: result.thumbnails,
      fileSize: result.fileSize,
    });
  }),
];

/**
 * Delete uploaded image
 * DELETE /api/upload/delete
 */
export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  const success = await UploadService.deleteImage(imageUrl);

  if (success) {
    res.json({ success: true, message: "Image deleted successfully" });
  } else {
    res.status(500).json({ error: "Failed to delete image" });
  }
});

/**
 * Get upload health status
 * GET /api/upload/health
 */
export const getUploadHealth = asyncHandler(
  async (req: Request, res: Response) => {
    res.json({
      success: true,
      status: "Upload service is running",
      config: {
        maxFileSize: "10MB",
        maxFiles: 5,
        supportedFormats: ["JPEG", "PNG", "WebP"],
        compressionQuality: 81,
        outputFormat: "WebP",
      },
    });
  }
);
