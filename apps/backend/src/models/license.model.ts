import mongoose, { Schema, Document } from "mongoose";

export interface ILicense extends Document {
  name: string;
  slug: string;
  price: number;
  courseLimit: number | null;
  chapterLimit: number | null;
  lessonLimit: number | null;
}

const licenseSchema = new Schema<ILicense>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  price: { type: Number, default: 0 },
  courseLimit: { type: Number, default: null },
  chapterLimit: { type: Number, default: null },
  lessonLimit: { type: Number, default: null },
});

export const LicenseModel =
  mongoose.models.License || mongoose.model<ILicense>("License", licenseSchema);
