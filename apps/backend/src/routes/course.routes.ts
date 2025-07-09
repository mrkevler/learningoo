import { Router } from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseSummaries,
  getCourseBySlug,
} from "../controllers/course.controller";
import { enrollCourse } from "../controllers/enrollment.controller";

const router = Router();

router.get("/summary", getCourseSummaries);

router.route("/").get(getCourses).post(createCourse);
router.route("/slug/:slug").get(getCourseBySlug);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

// purchase/enroll
router.post("/:id/enroll", enrollCourse);

export default router;
