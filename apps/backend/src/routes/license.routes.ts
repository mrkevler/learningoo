import { Router } from "express";
import {
  listLicenses,
  assignLicense,
  updateLicense,
} from "../controllers/license.controller";
import { requireAdmin } from "../utils/adminAuth";

const router = Router();

router.get("/", listLicenses);
router.post("/assign", assignLicense);
router.patch("/:id", requireAdmin, updateLicense);

export default router;
