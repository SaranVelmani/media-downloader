import { spawn } from "child_process";
import { env } from "../config/env";
import { AppError, classifyProviderError } from "../utils/errors";

function runYtDlp(args: string[], timeoutMs = env.requestTimeoutMs): Promise<{ stdout: Buffer; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(env.pythonPath, ["-m", "yt_dlp", ...args], { windowsHide: true });

    const stdoutChunks: Buffer[] = [];
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      reject(new AppError("TIMEOUT", "The request took too long to process.", 504));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => stdoutChunks.push(chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new AppError("SERVER_BUSY", `Downloader process failed to start: ${err.message}`, 500));
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code !== 0) {
        reject(classifyProviderError(stderr || `yt-dlp exited with code ${code}`));
        return;
      }
      resolve({ stdout: Buffer.concat(stdoutChunks), stderr });
    });
  });
}

export async function fetchMetadataJson(url: string): Promise<any> {
  const { stdout } = await runYtDlp(["-J", "--no-warnings", "--no-playlist", url]);
  try {
    return JSON.parse(stdout.toString("utf-8"));
  } catch {
    throw new AppError("INTERNAL_ERROR", "Failed to parse media metadata.", 500);
  }
}

export function spawnYtDlpStream(url: string, formatId: string) {
  return spawn(
    env.pythonPath,
    ["-m", "yt_dlp", "-f", formatId, "--no-warnings", "--no-playlist", "--no-part", "-o", "-", url],
    { windowsHide: true }
  );
}

export function spawnYtDlpVideoDownload(url: string, formatId: string, outTemplate: string, ffmpegPath: string) {
  return spawn(
    env.pythonPath,
    [
      "-m", "yt_dlp",
      "-f", `${formatId}+bestaudio/best`,
      "--no-playlist",
      "--merge-output-format", "mp4",
      "--ffmpeg-location", ffmpegPath,
      "-o", outTemplate,
      url,
    ],
    { windowsHide: true }
  );
}

export function spawnYtDlpAudioExtract(url: string, outFile: string, audioFormat: string, ffmpegPath: string) {
  return spawn(
    env.pythonPath,
    [
      "-m", "yt_dlp",
      "-f", "bestaudio/best",
      "--no-warnings",
      "--no-playlist",
      "--extract-audio",
      "--audio-format", audioFormat,
      "--audio-quality", "0",
      "--ffmpeg-location", ffmpegPath,
      "-o", outFile,
      url,
    ],
    { windowsHide: true }
  );
}
