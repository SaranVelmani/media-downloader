import { Request, Response } from "express";
import { analyzeUrl } from "../services/analyzeService";

export async function analyzeController(req: Request, res: Response) {
  const { url } = req.body as { url: string };
  const info = await analyzeUrl(url);
  res.json(info);
}
