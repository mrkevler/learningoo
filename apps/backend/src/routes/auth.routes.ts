import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["student", "tutor"]),
  ],
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  login
);

export default router;
