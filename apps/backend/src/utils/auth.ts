import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { EnrollmentModel } from "../models/enrollment.model";
import { CourseModel } from "../models/course.model";
import { ChapterModel } from "../models/chapter.model";
import { LessonModel } from "../models/lesson.model";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Basic authentication middleware - extracts user from token
export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    // Allow unauthenticated access - will be handled by access control
    return next();
  }

  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: payload.id,
      role: payload.role,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Check if user has access to a course owner or enrolled
export const checkCourseAccess = async (
  userId: string,
  courseId: string,
  userRole?: string
): Promise<{ hasAccess: boolean; isOwner: boolean }> => {
  if (!userId) {
    return { hasAccess: false, isOwner: false };
  }

  // Admin has access to everything
  if (userRole === "admin") {
    return { hasAccess: true, isOwner: true };
  }

  // Check if user is the course owner
  const course = await CourseModel.findById(courseId).select("tutorId");
  if (!course) {
    return { hasAccess: false, isOwner: false };
  }

  const isOwner = course.tutorId.toString() === userId;
  if (isOwner) {
    return { hasAccess: true, isOwner: true };
  }

  // Check if user is enrolled
  const enrollment = await EnrollmentModel.findOne({
    studentId: userId,
    courseId: courseId,
  });

  return { hasAccess: !!enrollment, isOwner: false };
};

// Check if user has access to a chapter via course access
export const checkChapterAccess = async (
  userId: string,
  chapterId: string,
  userRole?: string
): Promise<{ hasAccess: boolean; isOwner: boolean; courseId?: string }> => {
  if (!userId) {
    return { hasAccess: false, isOwner: false };
  }

  const chapter = await ChapterModel.findById(chapterId).select("courseId");
  if (!chapter) {
    return { hasAccess: false, isOwner: false };
  }

  const result = await checkCourseAccess(
    userId,
    chapter.courseId.toString(),
    userRole
  );
  return { ...result, courseId: chapter.courseId.toString() };
};

// Check if user has access to a lesson via chapter/course access
export const checkLessonAccess = async (
  userId: string,
  lessonId: string,
  userRole?: string
): Promise<{
  hasAccess: boolean;
  isOwner: boolean;
  courseId?: string;
  chapterId?: string;
}> => {
  if (!userId) {
    return { hasAccess: false, isOwner: false };
  }

  const lesson = await LessonModel.findById(lessonId).select("chapterId");
  if (!lesson) {
    return { hasAccess: false, isOwner: false };
  }

  const result = await checkChapterAccess(
    userId,
    lesson.chapterId.toString(),
    userRole
  );
  return { ...result, chapterId: lesson.chapterId.toString() };
};

// Middleware to require course access
export const requireCourseAccess = (paramName: string = "id") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params[paramName];
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { hasAccess } = await checkCourseAccess(
      userId,
      courseId,
      req.user?.role
    );
    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Access denied. Course enrollment required." });
    }

    next();
  };
};

// Middleware to require chapter access
export const requireChapterAccess = (paramName: string = "id") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const chapterId = req.params[paramName];
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { hasAccess } = await checkChapterAccess(
      userId,
      chapterId,
      req.user?.role
    );
    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Access denied. Course enrollment required." });
    }

    next();
  };
};

// Middleware to require lesson access
export const requireLessonAccess = (paramName: string = "id") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const lessonId = req.params[paramName];
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { hasAccess } = await checkLessonAccess(
      userId,
      lessonId,
      req.user?.role
    );
    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Access denied. Course enrollment required." });
    }

    next();
  };
};

// Middleware to require course ownership for creating/editing content
export const requireCourseOwnership = (paramName: string = "id") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params[paramName];
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { isOwner } = await checkCourseAccess(userId, courseId);
    if (!isOwner) {
      return res
        .status(403)
        .json({ message: "Access denied. Course ownership required." });
    }

    next();
  };
};

// Middleware to require chapter ownership for creating lessons in a chapter
export const requireChapterOwnership = (paramName: string = "chapterId") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Check if chapterId is in params for routes like /chapters/:id/lessons
    // or in body for lesson creation where chapterId is in request body
    const chapterId = req.params[paramName] || req.body[paramName];
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!chapterId) {
      return res.status(400).json({ message: "Chapter ID required" });
    }

    const { isOwner } = await checkChapterAccess(userId, chapterId);
    if (!isOwner) {
      return res.status(403).json({
        message:
          "Access denied. Course ownership required to create/edit lessons.",
      });
    }

    next();
  };
};

// Middleware to require lesson ownership for editing lessons
export const requireLessonOwnership = (paramName: string = "id") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const lessonId = req.params[paramName];
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { isOwner } = await checkLessonAccess(userId, lessonId);
    if (!isOwner) {
      return res.status(403).json({
        message: "Access denied. Course ownership required to edit lessons.",
      });
    }

    next();
  };
};
