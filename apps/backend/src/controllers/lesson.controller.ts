import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { LessonModel } from "../models/lesson.model";

export const getLessons = asyncHandler(async (_req: Request, res: Response) => {
  const lessons = await LessonModel.find();
  res.json(lessons);
});

export const getLesson = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await LessonModel.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  res.json(lesson);
});

export const createLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const lesson = await LessonModel.create(req.body);
    res.status(201).json(lesson);
  }
);

export const updateLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const lesson = await LessonModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  }
);

export const deleteLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const lesson = await LessonModel.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.status(204).send();
  }
);
