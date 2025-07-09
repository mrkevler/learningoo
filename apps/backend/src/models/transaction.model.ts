import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: "credit" | "debit";
  category: "license" | "course" | "topup";
  amount: number;
  relatedId?: Types.ObjectId; // courseId or licenseId
  counterpartId?: Types.ObjectId; // another user if applicable
  description?: string;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    category: {
      type: String,
      enum: ["license", "course", "topup"],
      required: true,
    },
    amount: { type: Number, required: true },
    relatedId: { type: Schema.Types.ObjectId },
    counterpartId: { type: Schema.Types.ObjectId, ref: "User" },
    description: String,
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, createdAt: -1 });

export const TransactionModel =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", transactionSchema);
