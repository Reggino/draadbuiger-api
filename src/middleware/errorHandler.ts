import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(500).json({
    message: err.message,
    serialized: err
  });
  console.log(err);
}
