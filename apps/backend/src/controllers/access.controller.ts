import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  checkCourseAccess,
  checkChapterAccess,
  checkLessonAccess,
} from "../utils/auth";

// Check access to a course
export const checkCourseAccessEndpoint = asyncHandler(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId;
    const userId = req.user?.id;

    if (!userId) {
      return res.json({ hasAccess: false, isOwner: false });
    }

    const result = await checkCourseAccess(userId, courseId);
    res.json(result);
  }
);

// Check access to a chapter
export const checkChapterAccessEndpoint = asyncHandler(
  async (req: Request, res: Response) => {
    const chapterId = req.params.chapterId;
    const userId = req.user?.id;

    if (!userId) {
      return res.json({ hasAccess: false, isOwner: false });
    }

    const result = await checkChapterAccess(userId, chapterId);
    res.json(result);
  }
);

// Check access to a lesson
export const checkLessonAccessEndpoint = asyncHandler(
  async (req: Request, res: Response) => {
    const lessonId = req.params.lessonId;
    const userId = req.user?.id;

    if (!userId) {
      return res.json({ hasAccess: false, isOwner: false });
    }

    const result = await checkLessonAccess(userId, lessonId);
    res.json(result);
  }
);
