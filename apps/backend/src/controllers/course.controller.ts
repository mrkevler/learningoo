import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CourseModel } from "../models/course.model";
import { ChapterModel } from "../models/chapter.model";

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
    const { chapters = [], ...courseData } = req.body;

    // Create course first (auto publish)
    const course = await CourseModel.create({
      ...courseData,
      isPublished: true,
    });

    // Create chapters if provided
    if (Array.isArray(chapters) && chapters.length > 0) {
      const docs = chapters.map((ch: any, idx: number) => ({
        ...ch,
        courseId: course._id,
        order: idx + 1,
      }));
      await ChapterModel.insertMany(docs);
    }

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

export const getCourseSummaries = asyncHandler(
  async (_req: Request, res: Response) => {
    const courses = await CourseModel.aggregate([
      { $match: { isPublished: true, isDeleted: false } },
      {
        $lookup: {
          from: "users",
          localField: "tutorId",
          foreignField: "_id",
          as: "tutor",
          pipeline: [{ $project: { _id: 1, name: 1 } }],
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "cat",
          pipeline: [{ $project: { _id: 0, name: 1 } }],
        },
      },
      {
        $lookup: {
          from: "chapters",
          localField: "_id",
          foreignField: "courseId",
          as: "chapters",
          pipeline: [{ $project: { _id: 1 } }],
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "chapters._id",
          foreignField: "chapterId",
          as: "lessons",
        },
      },
      {
        $addFields: {
          lessonCount: { $size: "$lessons" },
          tutorName: { $arrayElemAt: ["$tutor.name", 0] },
          tutorId: { $arrayElemAt: ["$tutor._id", 0] },
          categoryName: { $arrayElemAt: ["$cat.name", 0] },
        },
      },
      {
        $project: {
          lessons: 0,
          chapters: 0,
          tutor: 0,
          cat: 0,
          description: 0,
          isDeleted: 0,
          isPublished: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);
    res.json(courses);
  }
);

export const getCourseBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const course: any = await CourseModel.findOne({ slug })
      .populate("categoryId", "name slug")
      .populate("tutorId", "name authorName")
      .lean();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Fetch chapters (ordered)
    const chapters = await ChapterModel.find({ courseId: course._id })
      .sort({ order: 1 })
      .select("title coverImage order")
      .lean();

    (course as any).chapters = chapters;

    res.json(course);
  }
);
