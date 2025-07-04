import { Router } from "express";
import {
  getChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter,
} from "../controllers/chapter.controller";

const router = Router();

router.route("/").get(getChapters).post(createChapter);
router.route("/:id").get(getChapter).put(updateChapter).delete(deleteChapter);

export default router;
