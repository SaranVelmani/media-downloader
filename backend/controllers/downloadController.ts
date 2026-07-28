import { Request, Response } from "express";
import { streamMediaDownload } from "../services/downloadService";

export async function downloadController(req: Request, res: Response) {
  const { url, formatId, type, audioFormat } = req.body as {
    url: string;
    formatId?: string;
    type: "video" | "audio";
    audioFormat?: "mp3" | "m4a" | "wav" | "flac";
  };

  await streamMediaDownload({ url, formatId, type: type ?? "video", audioFormat }, res);
}
