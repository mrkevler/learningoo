import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { TransactionModel } from "../models/transaction.model";
import mongoose from "mongoose";

// List transactions for current user
export const listMyTransactions = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId || req.query.userId || (req as any).userId; // placeholder until auth middleware
    const id =
      userId && mongoose.Types.ObjectId.isValid(userId as any) ? userId : null;
    const filter = id ? { userId: id } : {};
    const txs = await TransactionModel.find(filter).sort({ createdAt: -1 });
    res.json(txs);
  }
);
