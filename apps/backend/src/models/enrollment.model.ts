import mongoose, { Document, Schema, Types } from "mongoose";

export interface IEnrollment extends Document {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  progress: {
    completedLessons: Types.ObjectId[];
    completed: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    progress: {
      completedLessons: { type: [Schema.Types.ObjectId], default: [] },
      completed: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

enrollmentSchema.index({ courseId: 1, "progress.completed": 1 });

enrollmentSchema.index({ studentId: 1, "progress.completed": 1 });

export const EnrollmentModel =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
