import { Router } from "express";
import {
  getEnrollments,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "../controllers/enrollment.controller";

const router = Router();

router.route("/").get(getEnrollments).post(createEnrollment);
router
  .route("/:id")
  .get(getEnrollment)
  .put(updateEnrollment)
  .delete(deleteEnrollment);

export default router;
