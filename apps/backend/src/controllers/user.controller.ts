import { asyncHandler } from "../utils/asyncHandler";
import { UserModel } from "../models/user.model";
import { Request, Response } from "express";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await UserModel.find();
  res.json(users);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.create(req.body);
  res.status(201).json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(204).send();
});
