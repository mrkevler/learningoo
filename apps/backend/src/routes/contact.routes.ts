import { Router } from "express";
import {
  getCaptcha,
  postContact,
  validateContact,
} from "../controllers/contact.controller";

const router = Router();

router.get("/captcha", getCaptcha);
router.post("/contact", validateContact, postContact);

export default router;
