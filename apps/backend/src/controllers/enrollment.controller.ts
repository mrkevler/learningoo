import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { EnrollmentModel } from "../models/enrollment.model";

export const getEnrollments = asyncHandler(
  async (_req: Request, res: Response) => {
    const enrollments = await EnrollmentModel.find();
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
