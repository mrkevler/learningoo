import { Router } from "express";

import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import courseRoutes from "./course.routes";
import chapterRoutes from "./chapter.routes";
import lessonRoutes from "./lesson.routes";
import enrollmentRoutes from "./enrollment.routes";
import licenseRoutes from "./license.routes";
import categoryRoutes from "./category.routes";
import contactRoutes from "./contact.routes";
import transactionRoutes from "./transaction.routes";
// TODO: import other feature routes

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/chapters", chapterRoutes);
router.use("/lessons", lessonRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/licenses", licenseRoutes);
router.use("/categories", categoryRoutes);
router.use("/", contactRoutes);
router.use("/transactions", transactionRoutes);

export default router;
