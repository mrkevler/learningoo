import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { CategoryModel } from "../models/category.model";
import { LicenseModel } from "../models/license.model";
import { CourseModel } from "../models/course.model";
import { UserModel } from "../models/user.model";
import { TransactionModel } from "../models/transaction.model";
import { getConfig, invalidateConfigCache } from "../utils/getConfig";
import { ConfigModel } from "../models/config.model";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { key, email, password } = req.body as {
    key?: string;
    email?: string;
    password?: string;
  };

  const validByKey =
    key &&
    key === process.env.L_ADMIN_KVLR &&
    password === process.env.L_PASSWORD;
  const validByEmail =
    email &&
    email === (process.env.L_ADMIN_EMAIL || "email@test.com") &&
    password === process.env.L_PASSWORD;

  if (!validByKey && !validByEmail) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

export const getSummary = asyncHandler(async (_req: Request, res: Response) => {
  const [categoryCount, licenseCount, courseCount, userCount, txCount] =
    await Promise.all([
      CategoryModel.countDocuments(),
      LicenseModel.countDocuments(),
      CourseModel.countDocuments(),
      UserModel.countDocuments(),
      TransactionModel.countDocuments(),
    ]);
  res.json({
    categories: categoryCount,
    licenses: licenseCount,
    courses: courseCount,
    users: userCount,
    transactions: txCount,
  });
});

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await UserModel.find()
    .select("-password")
    .populate({ path: "licenseId", select: "slug" });
  res.json(users);
});

export const listTransactions = asyncHandler(
  async (_req: Request, res: Response) => {
    const txs = await TransactionModel.find().sort({ createdAt: -1 });
    res.json(txs);
  }
);

export const getConfigHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const cfg = await getConfig();
    res.json(cfg);
  }
);

export const updateConfigHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { allowRegistration, allowLogin, defaultCredits } = req.body;
    const cfg = await ConfigModel.findOne();
    if (!cfg) {
      return res.status(500).json({ message: "Config not found" });
    }
    if (allowRegistration !== undefined)
      cfg.allowRegistration = allowRegistration;
    if (allowLogin !== undefined) cfg.allowLogin = allowLogin;
    if (defaultCredits !== undefined) cfg.defaultCredits = defaultCredits;
    await cfg.save();
    invalidateConfigCache();
    res.json(cfg);
  }
);

export const getSystemOverview = asyncHandler(
  async (_req: Request, res: Response) => {
    const [totalUsers, tutors, students, categories, courses] =
      await Promise.all([
        UserModel.countDocuments(),
        UserModel.countDocuments({ role: "tutor" }),
        UserModel.countDocuments({ role: "student" }),
        CategoryModel.countDocuments(),
        CourseModel.countDocuments(),
      ]);

    // license breakdown - count number of users with license slug
    const licenseCountsAgg = await UserModel.aggregate([
      {
        $lookup: {
          from: "licenses",
          localField: "licenseId",
          foreignField: "_id",
          as: "lic",
        },
      },
      {
        $addFields: {
          licenseSlug: {
            $cond: [
              { $eq: ["$role", "student"] },
              "student",
              { $arrayElemAt: ["$lic.slug", 0] },
            ],
          },
        },
      },
      { $group: { _id: "$licenseSlug", count: { $sum: 1 } } },
    ]);
    const licenseCounts: any = {
      student: 0,
      free: 0,
      startup: 0,
      advanced: 0,
      pro: 0,
    };
    for (const lc of licenseCountsAgg)
      licenseCounts[lc._id || "unknown"] = lc.count;

    // revenue
    const revenueAgg = await TransactionModel.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);
    let revenueTotal = 0,
      revenueLicenses = 0,
      revenueCourses = 0;
    for (const r of revenueAgg) {
      revenueTotal += r.total;
      if (r._id === "license") revenueLicenses = r.total;
      if (r._id === "course") revenueCourses = r.total;
    }

    // top earner - sum of credit by userId
    const topEarnerAgg = await TransactionModel.aggregate([
      { $group: { _id: "$userId", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);
    let topEarner = null;
    if (topEarnerAgg.length) {
      const user = await UserModel.findById(topEarnerAgg[0]._id);
      topEarner = { amount: topEarnerAgg[0].total, user };
    }

    res.json({
      totalUsers,
      tutors,
      students,
      categories,
      courses,
      licenses: licenseCounts,
      revenueTotal,
      revenueLicenses,
      revenueCourses,
      topEarner,
    });
  }
);

// Update user fields
export const updateUserAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { balance, isActive, licenseSlug, newPassword } = req.body;
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (balance !== undefined) user.balance = balance;
    if (isActive !== undefined) user.isActive = isActive;
    if (licenseSlug !== undefined) {
      if (licenseSlug === "student") {
        user.licenseId = null;
        user.role = "student";
      } else {
        const lic = await LicenseModel.findOne({ slug: licenseSlug });
        if (!lic) return res.status(404).json({ message: "License not found" });
        user.licenseId = lic._id;
        user.role = "tutor";
      }
    }
    if (newPassword) {
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
    }
    await user.save();
    res.json(user);
  }
);
