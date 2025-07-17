import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_CONFIG } from "../config/storage";

// Interface for uploaded files
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface ProcessedImage {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
}

export interface ProcessImageOptions {
  type: keyof typeof UPLOAD_CONFIG;
  originalName?: string;
  preserveAspectRatio?: boolean;
}

/**
 * Process and optimize images for different upload types
 */
export class ImageProcessor {
  /**
   * Main image processing function
   */
  static async processImage(
    inputBuffer: Buffer,
    options: ProcessImageOptions
  ): Promise<ProcessedImage[]> {
    const config = UPLOAD_CONFIG[options.type];
    const fileId = uuidv4();
    const results: ProcessedImage[] = [];

    // Process main image
    const mainImage = await this.processMainImage(
      inputBuffer,
      config,
      fileId,
      options
    );
    results.push(mainImage);

    // Process thumbnails if they exist (for profile photos)
    if ("thumbnails" in config && config.thumbnails) {
      for (const thumbConfig of config.thumbnails) {
        const thumbnail = await this.processThumbnail(
          inputBuffer,
          config,
          thumbConfig,
          fileId
        );
        results.push(thumbnail);
      }
    }

    return results;
  }

  /**
   * Process the main image
   */
  private static async processMainImage(
    inputBuffer: Buffer,
    config: any,
    fileId: string,
    options: ProcessImageOptions
  ): Promise<ProcessedImage> {
    let sharpInstance = sharp(inputBuffer)
      .rotate() // Auto-orient and remove EXIF data
      .normalize(); // Auto-adjust brightness/contrast

    // Handle resizing based on config
    if (config.width && config.height) {
      // Fixed dimensions (course covers, profile photos)
      sharpInstance = sharpInstance.resize(config.width, config.height, {
        fit: "cover", // Crop to exact dimensions
        position: "center",
      });
    } else if (config.width && !config.height) {
      // Width only, maintain aspect ratio (lesson images)
      sharpInstance = sharpInstance.resize(config.width, null, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Apply format and compression
    switch (config.format) {
      case "webp":
        sharpInstance = sharpInstance.webp({
          quality: config.quality,
          effort: 6, // Higher effort for better compression
        });
        break;
      case "jpeg":
        sharpInstance = sharpInstance.jpeg({
          quality: config.quality,
          progressive: true,
        });
        break;
      case "png":
        sharpInstance = sharpInstance.png({
          compressionLevel: 9,
          quality: config.quality,
        });
        break;
    }

    const buffer = await sharpInstance.toBuffer();
    const filename = `${fileId}.${config.format}`;

    return {
      buffer,
      filename,
      mimeType: `image/${config.format}`,
      size: buffer.length,
    };
  }

  /**
   * Process thumbnail images
   */
  private static async processThumbnail(
    inputBuffer: Buffer,
    config: any,
    thumbConfig: any,
    fileId: string
  ): Promise<ProcessedImage> {
    const buffer = await sharp(inputBuffer)
      .rotate()
      .normalize()
      .resize(thumbConfig.width, thumbConfig.height, {
        fit: "cover",
        position: "center",
      })
      .webp({
        quality: config.quality,
        effort: 6,
      })
      .toBuffer();

    const filename = `${fileId}${thumbConfig.suffix}.${config.format}`;

    return {
      buffer,
      filename,
      mimeType: `image/${config.format}`,
      size: buffer.length,
    };
  }

  /**
   * Validate image format and size
   */
  static validateImage(file: MulterFile): {
    valid: boolean;
    error?: string;
  } {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
      };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File too large. Maximum size is 10MB.",
      };
    }

    return { valid: true };
  }

  /**
   * Generate optimized filename with folder structure
   */
  static generateFilePath(
    type: keyof typeof UPLOAD_CONFIG,
    filename: string
  ): string {
    const config = UPLOAD_CONFIG[type];
    const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    return `${config.folder}/${timestamp}/${filename}`;
  }
}

// Export functions for backward compatibility
export const processUserAvatar = async (buffer: Buffer): Promise<Buffer> => {
  const results = await ImageProcessor.processImage(buffer, {
    type: "profilePhoto",
    originalName: "avatar.jpg",
  });
  return results[0].buffer;
};

export const processCourseImage = async (buffer: Buffer): Promise<Buffer> => {
  const results = await ImageProcessor.processImage(buffer, {
    type: "courseCover",
    originalName: "course.jpg",
  });
  return results[0].buffer;
};

export const processLessonImage = async (buffer: Buffer): Promise<Buffer> => {
  const results = await ImageProcessor.processImage(buffer, {
    type: "lessonImage",
    originalName: "lesson.jpg",
  });
  return results[0].buffer;
};
