import fs from "fs";
import path from "path";
import { Response } from "express";
import { env } from "../config/env";
import { resolveProvider } from "./providers/registry";
import { spawnYtDlpVideoDownload, spawnYtDlpAudioExtract } from "../download/ytdlp";
import { AppError, classifyProviderError } from "../utils/errors";

export interface DownloadRequest {
  url: string;
  formatId?: string;
  type: "video" | "audio";
  audioFormat?: "mp3" | "m4a" | "wav" | "flac";
}

function safeFilename(title: string, ext: string) {
  const cleaned = title.replace(/[\\/:*?"<>|]/g, "_").slice(0, 80).trim() || "download";
  return `${cleaned}.${ext}`;
}

export async function streamMediaDownload(req: DownloadRequest, res: Response): Promise<void> {
  resolveProvider(req.url); // throws UNSUPPORTED_PLATFORM if not supported

  if (req.type === "video") {
    if (!req.formatId) {
      throw new AppError("INVALID_URL", "A formatId is required for video downloads.", 400);
    }
    await streamMergedVideo(req.url, req.formatId, res);
    return;
  }

  await streamConvertedAudio(req.url, req.audioFormat ?? "mp3", res);
}

async function streamMergedVideo(url: string, formatId: string, res: Response): Promise<void> {
  await fs.promises.mkdir(env.tempDir, { recursive: true });
  const jobId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const outTemplate = path.join(env.tempDir, `${jobId}.%(ext)s`);
  const expectedFile = path.join(env.tempDir, `${jobId}.mp4`);

  await new Promise<void>((resolve, reject) => {
    const child = spawnYtDlpVideoDownload(url, formatId, outTemplate, env.ffmpegPath);
    let stderr = "";
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    child.on("error", (err) => reject(new AppError("SERVER_BUSY", `Downloader failed to start: ${err.message}`, 500)));
    child.on("close", (code) => {
      if (code !== 0) {
        reject(classifyProviderError(stderr || `yt-dlp exited with code ${code}`));
        return;
      }
      resolve();
    });
  });

  if (!fs.existsSync(expectedFile)) {
    throw new AppError("CONVERSION_FAILED", "Video merge failed to produce an output file.", 500);
  }

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${safeFilename(jobId, "mp4")}"`);

  const cleanup = () => fs.promises.unlink(expectedFile).catch(() => {});
  const readStream = fs.createReadStream(expectedFile);
  readStream.pipe(res);
  readStream.on("close", cleanup);
  readStream.on("error", cleanup);
}

async function streamConvertedAudio(url: string, audioFormat: string, res: Response): Promise<void> {
  await fs.promises.mkdir(env.tempDir, { recursive: true });
  const jobId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const outTemplate = path.join(env.tempDir, `${jobId}.%(ext)s`);
  const expectedFile = path.join(env.tempDir, `${jobId}.${audioFormat}`);

  await new Promise<void>((resolve, reject) => {
    const child = spawnYtDlpAudioExtract(url, outTemplate, audioFormat, env.ffmpegPath);
    let stderr = "";
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    child.on("error", (err) => reject(new AppError("SERVER_BUSY", `Downloader failed to start: ${err.message}`, 500)));
    child.on("close", (code) => {
      if (code !== 0) {
        reject(classifyProviderError(stderr || `yt-dlp exited with code ${code}`));
        return;
      }
      resolve();
    });
  });

  if (!fs.existsSync(expectedFile)) {
    throw new AppError("CONVERSION_FAILED", "Audio conversion failed to produce an output file.", 500);
  }

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${safeFilename(jobId, audioFormat)}"`);

  const cleanup = () => fs.promises.unlink(expectedFile).catch(() => {});
  const readStream = fs.createReadStream(expectedFile);
  readStream.pipe(res);
  readStream.on("close", cleanup);
  readStream.on("error", cleanup);
}
