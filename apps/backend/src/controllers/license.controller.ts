import { Request, Response } from "express";
import { LicenseModel } from "../models/license.model";
import { UserModel } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";

export const listLicenses = asyncHandler(
  async (_req: Request, res: Response) => {
    const licenses = await LicenseModel.find().sort({ price: 1 });
    res.json(licenses);
  }
);

export const assignLicense = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, licenseSlug } = req.body;
    const lic = await LicenseModel.findOne({ slug: licenseSlug });
    if (!lic) return res.status(404).json({ message: "License not found" });
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { role: "tutor", licenseId: lic._id },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "upgraded", license: lic, user });
  }
);
