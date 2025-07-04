import { Router } from "express";
import {
  getCategories,
  createCategory,
} from "../controllers/category.controller";

const router = Router();

router.route("/").get(getCategories).post(createCategory);

export default router;
