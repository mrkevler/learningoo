import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CourseModel } from "../models/course.model";

export const getCourses = asyncHandler(async (_req: Request, res: Response) => {
  const courses = await CourseModel.find().populate("categoryId", "name slug");
  res.json(courses);
});

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await CourseModel.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await CourseModel.create(req.body);
    res.status(201).json(course);
  }
);

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await CourseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  }
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await CourseModel.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(204).send();
  }
);
