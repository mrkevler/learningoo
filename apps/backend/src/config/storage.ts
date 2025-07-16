import { S3Client } from "@aws-sdk/client-s3";

// Cloudflare R2 Configuration
export const r2Client = new S3Client({
  region: "auto", // R2 uses 'auto' as the region
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "learningoo";
export const R2_PUBLIC_URL =
  process.env.R2_PUBLIC_URL ||
  `https://pub-${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.dev`;

// Image upload configuration
export const UPLOAD_CONFIG = {
  // Course cover images - landscape format
  courseCover: {
    width: 800,
    height: 450,
    quality: 81,
    format: "webp" as const,
    folder: "courses/covers",
  },
  // Chapter cover images - landscape format
  chapterCover: {
    width: 800,
    height: 400,
    quality: 81,
    format: "webp" as const,
    folder: "chapters/covers",
  },
  // Course photo gallery - responsive sizes
  coursePhoto: {
    width: 1200,
    height: 800,
    quality: 81,
    format: "webp" as const,
    folder: "courses/photos",
  },
  // Lesson content images - flexible size
  lessonImage: {
    width: 1200,
    height: null, // maintain aspect ratio
    quality: 81,
    format: "webp" as const,
    folder: "lessons/images",
  },
  // Profile photos - square format with multiple sizes
  profilePhoto: {
    width: 400,
    height: 400,
    quality: 85,
    format: "webp" as const,
    folder: "users/profiles",
    thumbnails: [
      { width: 64, height: 64, suffix: "_64" },
      { width: 128, height: 128, suffix: "_128" },
      { width: 200, height: 200, suffix: "_200" },
    ],
  },
} as const;
