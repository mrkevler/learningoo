import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "tutor" | "student";
  isActive: boolean;
  isDeleted: boolean;
  authorName?: string;
  bio?: string;
  balance: number;
  categories: Schema.Types.ObjectId[];
  profileImage?: string;
  profileThumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
  createdAt: Date;
  updatedAt: Date;
  licenseId?: Schema.Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "tutor", "student"],
      default: "student",
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    licenseId: { type: Schema.Types.ObjectId, ref: "License", default: null },
    authorName: { type: String, trim: true, default: null },
    bio: { type: String, default: null },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category", default: [] }],
    balance: { type: Number, default: 100 },
    profileImage: { type: String, default: null },
    profileThumbnails: {
      type: {
        small: { type: String },
        medium: { type: String },
        large: { type: String },
      },
      default: null,
    },
  },
  { timestamps: true }
);

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
