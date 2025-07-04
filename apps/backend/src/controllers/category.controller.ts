import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CategoryModel } from "../models/category.model";

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await CategoryModel.find();
    res.json(categories);
  }
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const cat = await CategoryModel.create(req.body);
    res.status(201).json(cat);
  }
);
