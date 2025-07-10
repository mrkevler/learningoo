import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { getConfig } from "../utils/getConfig";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const cfg = await getConfig();
  if (!cfg.allowRegistration)
    return res
      .status(503)
      .json({ message: "Registration temporarily disabled" });
  const { name, email, password, role: requestedRole } = req.body;
  const existing = await UserModel.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already used" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    name,
    email,
    password: hashed,
    role: requestedRole === "tutor" ? "tutor" : "student",
    balance: cfg.defaultCredits,
  });
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      authorName: user.authorName,
      bio: user.bio,
      categories: user.categories,
      balance: user.balance,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const adminEmail = process.env.L_ADMIN_EMAIL;
  const isAdminCred =
    email === adminEmail && password === process.env.L_PASSWORD;

  // Allow admin login regardless of allowLogin flag
  const cfg = await getConfig();
  if (!cfg.allowLogin && !isAdminCred)
    return res.status(503).json({ message: "Login temporarily disabled" });

  if (isAdminCred) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({
      token,
      user: {
        _id: "admin",
        name: "Admin",
        email: adminEmail,
        role: "admin",
        balance: 0,
      },
    });
  }

  const user = await UserModel.findOne({ email }).select("+password");
  // If regular user exists → normal flow
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authorName: user.authorName,
        bio: user.bio,
        categories: user.categories,
        balance: user.balance,
      },
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});
