import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { requireAdmin } from "../utils/adminAuth";

const router = Router();

router.route("/").get(getCategories).post(requireAdmin, createCategory);
router
  .route("/:id")
  .patch(requireAdmin, updateCategory)
  .delete(requireAdmin, deleteCategory);

export default router;
