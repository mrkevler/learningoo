import { Router } from "express";
import {
  getChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter,
} from "../controllers/chapter.controller";
import {
  authenticateUser,
  requireChapterAccess,
  requireCourseOwnership,
} from "../utils/auth";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

router.route("/").get(getChapters).post(createChapter); // Chapter creation handled in course creation
router
  .route("/:id")
  .get(requireChapterAccess(), getChapter)
  .put(updateChapter) // TODO: Add ownership check for chapter editing
  .delete(deleteChapter); // TODO: Add ownership check for chapter deletion

export default router;
