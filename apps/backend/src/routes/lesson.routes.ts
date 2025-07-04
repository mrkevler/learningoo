import { Router } from "express";
import {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller";

const router = Router();

router.route("/").get(getLessons).post(createLesson);
router.route("/:id").get(getLesson).put(updateLesson).delete(deleteLesson);

export default router;
