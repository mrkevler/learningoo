import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing token" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== "admin")
      return res.status(403).json({ message: "Admins only" });
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
