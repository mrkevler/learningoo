import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILesson extends Document {
  title: string;
  chapterId: Types.ObjectId;
  contentBlocks: Record<string, unknown>[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contentBlocks: { type: [Schema.Types.Mixed] as any, default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

lessonSchema.index({ chapterId: 1, order: 1 });

export const LessonModel =
  mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", lessonSchema);
