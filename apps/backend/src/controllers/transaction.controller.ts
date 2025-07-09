import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { TransactionModel } from "../models/transaction.model";

// List transactions for current user
export const listMyTransactions = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId || req.query.userId || (req as any).userId; // placeholder until auth middleware
    const txs = await TransactionModel.find({ userId }).sort({ createdAt: -1 });
    res.json(txs);
  }
);
