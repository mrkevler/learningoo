import { Request, Response } from "express";
import { LicenseModel } from "../models/license.model";
import { UserModel } from "../models/user.model";
import { TransactionModel } from "../models/transaction.model";
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

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Skip charge for free license
    if (lic.price > 0) {
      if (user.balance < lic.price)
        return res.status(400).json({ message: "Insufficient balance" });
      user.balance -= lic.price;

      await TransactionModel.create({
        userId: user._id,
        type: "debit",
        category: "license",
        amount: lic.price,
        relatedId: lic._id,
        description: `Purchased ${lic.slug} license`,
      });
    }

    user.role = "tutor";
    user.licenseId = lic._id;
    await user.save();

    res.json({ message: "upgraded", license: lic, user });
  }
);
