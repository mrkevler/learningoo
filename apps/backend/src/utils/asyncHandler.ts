import { Request, Response, NextFunction } from "express";

export const asyncHandler =
  <T extends Request = Request, R extends Response = Response>(
    fn: (req: T, res: R, next: NextFunction) => Promise<unknown>
  ) =>
  (req: T, res: R, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
