import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { middlewareSchema } from "schemas/auth.schemas";

export function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    const parsedData = middlewareSchema.parse(decoded);
    req.user = parsedData;
    next();
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json({ message: "Invalid token" });
  }
}
