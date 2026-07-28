import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/errors";

const bodySchema = z.object({
  url: z.string().min(1, "EMPTY_URL"),
});

export function validateUrlBody(req: Request, _res: Response, next: NextFunction) {
  const url = req.body?.url;

  if (url === undefined || url === null || String(url).trim() === "") {
    throw new AppError("EMPTY_URL", "Please paste a media URL.", 400);
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError("INVALID_URL", "Please provide a valid URL.", 400);
  }

  try {
    new URL(url);
  } catch {
    throw new AppError("INVALID_URL", "That doesn't look like a valid URL.", 400);
  }

  next();
}
