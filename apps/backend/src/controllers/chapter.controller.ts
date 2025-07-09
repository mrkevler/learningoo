import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ChapterModel } from "../models/chapter.model";
import { LessonModel } from "../models/lesson.model";

export const getChapters = asyncHandler(
  async (_req: Request, res: Response) => {
    const chapters = await ChapterModel.find();
    res.json(chapters);
  }
);

export const getChapter = asyncHandler(async (req: Request, res: Response) => {
  const chapter = await ChapterModel.findById(req.params.id)
    .populate({ path: "courseId", select: "tutorId title slug" })
    .lean();

  if (!chapter) return res.status(404).json({ message: "Chapter not found" });

  // Fetch lessons ordered by "order"
  const lessons = await LessonModel.find({ chapterId: (chapter as any)._id })
    .sort({ order: 1 })
    .select("title order createdAt updatedAt")
    .lean();

  (chapter as any).lessons = lessons;

  res.json(chapter);
});

export const createChapter = asyncHandler(
  async (req: Request, res: Response) => {
    const chapter = await ChapterModel.create(req.body);
    res.status(201).json(chapter);
  }
);

export const updateChapter = asyncHandler(
  async (req: Request, res: Response) => {
    const chapter = await ChapterModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });
    res.json(chapter);
  }
);

export const deleteChapter = asyncHandler(
  async (req: Request, res: Response) => {
    const chapter = await ChapterModel.findByIdAndDelete(req.params.id);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });
    res.status(204).send();
  }
);
