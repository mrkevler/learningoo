import { Router } from "express";
import { listLicenses, assignLicense } from "../controllers/license.controller";

const router = Router();

router.get("/", listLicenses);
router.post("/assign", assignLicense);

export default router;
