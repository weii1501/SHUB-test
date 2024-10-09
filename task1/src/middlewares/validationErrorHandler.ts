import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validationErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }
  next();
};
