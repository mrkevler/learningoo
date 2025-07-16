import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "../config/storage";
import {
  ImageProcessor,
  ProcessImageOptions,
  ProcessedImage,
} from "./imageProcessor";

export interface UploadResult {
  success: boolean;
  urls: string[];
  thumbnails?: Record<string, string>;
  error?: string;
  fileSize?: number;
}

export class UploadService {
  /**
   * Upload image with processing and optimization
   */
  static async uploadImage(
    fileBuffer: Buffer,
    options: ProcessImageOptions
  ): Promise<UploadResult> {
    try {
      // Process the image(s)
      const processedImages = await ImageProcessor.processImage(
        fileBuffer,
        options
      );

      const uploadPromises = processedImages.map((image) =>
        this.uploadToR2(image, options.type)
      );

      const uploadResults = await Promise.all(uploadPromises);

      // Check if all uploads succeeded
      const failedUploads = uploadResults.filter((result) => !result.success);
      if (failedUploads.length > 0) {
        throw new Error(`Failed to upload ${failedUploads.length} files`);
      }

      // Organize results
      const mainUrl = uploadResults[0].url;
      const thumbnails: Record<string, string> = {};

      // For profile photos, organize thumbnails
      if (options.type === "profilePhoto" && uploadResults.length > 1) {
        uploadResults.slice(1).forEach((result, index) => {
          const size = ["64", "128", "200"][index];
          if (size) {
            thumbnails[size] = result.url;
          }
        });
      }

      return {
        success: true,
        urls: [mainUrl],
        thumbnails: Object.keys(thumbnails).length > 0 ? thumbnails : undefined,
        fileSize: processedImages[0].size,
      };
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof Error && error.stack) {
        console.error(error.stack);
      }
      return {
        success: false,
        urls: [],
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  /**
   * Upload a single processed image to R2
   */
  private static async uploadToR2(
    image: ProcessedImage,
    type: keyof typeof import("../config/storage").UPLOAD_CONFIG
  ): Promise<{ success: boolean; url: string; error?: string }> {
    try {
      const filePath = ImageProcessor.generateFilePath(type, image.filename);

      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: filePath,
        Body: image.buffer,
        ContentType: image.mimeType,
        ContentLength: image.size,
        CacheControl: "public, max-age=31536000", // 1 year cache
        Metadata: {
          "original-size": image.size.toString(),
          "upload-date": new Date().toISOString(),
        },
      });

      await r2Client.send(command);

      const publicUrl = `${R2_PUBLIC_URL}/${filePath}`;

      return {
        success: true,
        url: publicUrl,
      };
    } catch (error) {
      console.error("R2 upload error:", error);
      return {
        success: false,
        url: "",
        error: error instanceof Error ? error.message : "Upload to R2 failed",
      };
    }
  }

  /**
   * Delete image from R2
   */
  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extract the key from the URL
      const urlParts = imageUrl.replace(R2_PUBLIC_URL + "/", "");

      const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: urlParts,
      });

      await r2Client.send(command);
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      return false;
    }
  }

  /**
   * Generate a pre-signed URL for direct uploads (if needed)
   */
  static async generatePresignedUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(r2Client, command, { expiresIn });
  }

  /**
   * Validate multiple files for bulk upload
   */
  static validateFiles(files: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const validation = ImageProcessor.validateImage(files[i]);
      if (!validation.valid && validation.error) {
        errors.push(`File ${i + 1}: ${validation.error}`);
      }
    }

    // Check total size limit (50MB for all files)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 50 * 1024 * 1024; // 50MB

    if (totalSize > maxTotalSize) {
      errors.push("Total file size exceeds 50MB limit");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
