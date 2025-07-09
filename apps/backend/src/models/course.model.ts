import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description?: string;
  categoryId: Types.ObjectId;
  coverImage: string;
  photos?: string[];
  price: number;
  tutorId: Types.ObjectId;
  isPublished: boolean;
  isDeleted: boolean;
  welcomeEmailSubject?: string;
  welcomeEmailBody?: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    coverImage: { type: String },
    photos: { type: [String], default: [] },
    welcomeEmailSubject: { type: String },
    welcomeEmailBody: { type: String },
    price: { type: Number, default: 0 },
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

courseSchema.index({ tutorId: 1, isPublished: 1 });

export const CourseModel =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);
