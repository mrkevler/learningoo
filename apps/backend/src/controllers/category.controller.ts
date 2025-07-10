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

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, slug } = req.body;
    const cat = await CategoryModel.findById(id);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    if (name !== undefined) cat.name = name;
    if (slug !== undefined) cat.slug = slug;
    await cat.save();
    res.json(cat);
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const cat = await CategoryModel.findById(id);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    await cat.deleteOne();
    res.json({ message: "deleted" });
  }
);
