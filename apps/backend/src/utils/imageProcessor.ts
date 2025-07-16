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

// Processed image result
interface ProcessedImage {
  buffer: Buffer;
  filename: string;
  contentType: string;
  size: number;
}

// Processing options
interface ProcessImageOptions {
  type: keyof typeof UPLOAD_CONFIG;
  originalName: string;
}

export class ImageProcessor {
  static async processImage(
    inputBuffer: Buffer,
    options: ProcessImageOptions
  ): Promise<ProcessedImage[]> {
    const fileId = uuidv4();
    const timestamp = Date.now();
    const extension = this.getFileExtension(options.originalName);

    // Create filename
    const filename = `${options.type}_${fileId}_${timestamp}${extension}`;

    // Return original image without processing
    const result: ProcessedImage = {
      buffer: inputBuffer,
      filename: filename,
      contentType: this.getContentType(extension),
      size: inputBuffer.length,
    };

    return [result];
  }

  /**
   * Get file extension from filename
   */
  private static getFileExtension(filename: string): string {
    const extension = filename.toLowerCase().match(/\.[^.]+$/);
    return extension ? extension[0] : ".jpg";
  }

  /**
   * Get content type from file extension
   */
  private static getContentType(extension: string): string {
    const contentTypes: { [key: string]: string } = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
    };
    return contentTypes[extension.toLowerCase()] || "image/jpeg";
  }

  /**
   * Validate image file
   */
  static validateImage(file: MulterFile): boolean {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    if (file.size > maxSize) {
      throw new Error(
        `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
      );
    }

    return true;
  }
}

// Export functions for backward compatibility
export const processUserAvatar = async (buffer: Buffer): Promise<Buffer> => {
  // Return original buffer without processing
  return buffer;
};

export const processCourseImage = async (buffer: Buffer): Promise<Buffer> => {
  // Return original buffer without processing
  return buffer;
};

export const processLessonImage = async (buffer: Buffer): Promise<Buffer> => {
  // Return original buffer without processing
  return buffer;
};
