import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { ZodError } from "zod";

export function errorHadling(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ message: err.issues[0]?.message });
    return;
  }

  res.status(500).json({ message: "Erro interno do servidor." })
  return;
}