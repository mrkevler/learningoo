import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 });

export const CategoryModel =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);
