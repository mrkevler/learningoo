import { Router } from "express";
import { authenticateUser } from "../utils/auth";
import {
  checkCourseAccessEndpoint,
  checkChapterAccessEndpoint,
  checkLessonAccessEndpoint,
} from "../controllers/access.controller";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Access check endpoints
router.get("/course/:courseId", checkCourseAccessEndpoint);
router.get("/chapter/:chapterId", checkChapterAccessEndpoint);
router.get("/lesson/:lessonId", checkLessonAccessEndpoint);

export default router;
