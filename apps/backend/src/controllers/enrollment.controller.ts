import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { EnrollmentModel } from "../models/enrollment.model";
import { CourseModel } from "../models/course.model";
import { UserModel } from "../models/user.model";
import { TransactionModel } from "../models/transaction.model";

export const getEnrollments = asyncHandler(
  async (_req: Request, res: Response) => {
    const { studentId, courseId } = _req.query;
    const filter: any = {};
    if (studentId) filter.studentId = studentId;
    if (courseId) filter.courseId = courseId;
    const enrollments = await EnrollmentModel.find(filter);
    res.json(enrollments);
  }
);

export const getEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollment = await EnrollmentModel.findById(req.params.id);
    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });
    res.json(enrollment);
  }
);

export const createEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollment = await EnrollmentModel.create(req.body);
    res.status(201).json(enrollment);
  }
);

export const updateEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollment = await EnrollmentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });
    res.json(enrollment);
  }
);

export const deleteEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollment = await EnrollmentModel.findByIdAndDelete(req.params.id);
    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });
    res.status(204).send();
  }
);

// Enroll in a course with balance deduction
export const enrollCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const courseId = req.params.id;
    const { studentId } = req.body; // TODO: replace with auth middleware extraction

    const course = await CourseModel.findById(courseId).select("price tutorId");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const user = await UserModel.findById(studentId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check existing enrollment
    const exists = await EnrollmentModel.findOne({
      studentId: user._id,
      courseId,
    });
    if (exists) return res.status(409).json({ message: "Already enrolled" });

    if (user.balance < course.price) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance from student
    user.balance -= course.price;
    await user.save();

    await TransactionModel.create({
      userId: user._id,
      type: "debit",
      category: "course",
      amount: course.price,
      relatedId: course._id,
      counterpartId: course.tutorId,
      description: `Purchased course ${courseId}`,
    });

    // Credit tutor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tutor: any = await UserModel.findById(course.tutorId);
    if (tutor) {
      tutor.balance = (tutor.balance || 0) + course.price;
      await tutor.save();

      await TransactionModel.create({
        userId: tutor._id,
        type: "credit",
        category: "course",
        amount: course.price,
        relatedId: course._id,
        counterpartId: user._id,
        description: `Sale course ${courseId}`,
      });
    }

    const enrollment = await EnrollmentModel.create({
      studentId: user._id,
      courseId,
    });

    res.status(201).json({ enrollment, balance: user.balance });
  }
);
