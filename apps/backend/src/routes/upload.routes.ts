import { Router } from "express";
import {
  uploadCourseCover,
  uploadChapterCover,
  uploadCoursePhotos,
  uploadLessonImage,
  uploadProfilePhoto,
  deleteImage,
  getUploadHealth,
} from "../controllers/upload.controller";

const router = Router();

// Health check endpoint
router.get("/health", getUploadHealth);

// Course-related uploads
router.post("/course-cover", uploadCourseCover);
router.post("/course-photos", uploadCoursePhotos);

// Chapter-related uploads
router.post("/chapter-cover", uploadChapterCover);

// Lesson-related uploads
router.post("/lesson-image", uploadLessonImage);

// User-related uploads
router.post("/profile-photo", uploadProfilePhoto);

// Delete operations
router.delete("/delete", deleteImage);

export default router;
