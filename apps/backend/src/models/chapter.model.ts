import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChapter extends Document {
  title: string;
  description?: string;
  courseId: Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  coverImage?: string;
}

const chapterSchema = new Schema<IChapter>(
  {
    title: { type: String, required: true },
    description: String,
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, default: 0 },
    coverImage: { type: String },
  },
  { timestamps: true }
);

chapterSchema.index({ courseId: 1, order: 1 });

export const ChapterModel =
  mongoose.models.Chapter || mongoose.model<IChapter>("Chapter", chapterSchema);
