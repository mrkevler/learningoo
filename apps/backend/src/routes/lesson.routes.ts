import { Router } from "express";
import {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller";
import {
  authenticateUser,
  requireLessonAccess,
  requireChapterOwnership,
  requireLessonOwnership,
} from "../utils/auth";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

router.route("/").get(getLessons).post(requireChapterOwnership(), createLesson);
router
  .route("/:id")
  .get(requireLessonAccess(), getLesson)
  .put(requireLessonOwnership(), updateLesson)
  .delete(requireLessonOwnership(), deleteLesson);

export default router;
