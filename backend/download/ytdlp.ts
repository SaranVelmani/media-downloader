import { spawn } from "child_process";
import path from "path";
import { env } from "../config/env";
import { AppError, classifyProviderError } from "../utils/errors";

// yt-dlp treats --ffmpeg-location as a literal path, not a PATH lookup.
// Only pass it when we have a real absolute path (Windows); otherwise let
// yt-dlp find ffmpeg on PATH itself (true on Linux hosts like Render).
function ffmpegLocationArgs(ffmpegPath: string): string[] {
  return path.isAbsolute(ffmpegPath) ? ["--ffmpeg-location", ffmpegPath] : [];
}

// YouTube bot-checks requests from datacenter IPs ("Sign in to confirm
// you're not a bot"). The bgutil-ytdlp-pot-provider plugin (installed in
// the Dockerfile, server running as a sidecar) supplies a valid PO token
// automatically for the default web client - no args needed here. Cookies
// are an optional extra if a secret file is present.
function youtubeAuthArgs(): string[] {
  return env.youtubeCookiesPath ? ["--cookies", env.youtubeCookiesPath] : [];
}

// yt-dlp needs a JS runtime to solve YouTube's challenges; Node is already
// in this image but isn't detected unless explicitly named.
const JS_RUNTIME_ARGS = ["--js-runtimes", "node"];

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
        console.error(`yt-dlp exited with code ${code}, args: ${args.join(" ")}\n${stderr}`);
        reject(classifyProviderError(stderr || `yt-dlp exited with code ${code}`));
        return;
      }
      resolve({ stdout: Buffer.concat(stdoutChunks), stderr });
    });
  });
}

export async function fetchMetadataJson(url: string): Promise<any> {
  const { stdout } = await runYtDlp(["-J", "-v", "--no-warnings", "--no-playlist", ...youtubeAuthArgs(), ...JS_RUNTIME_ARGS, url]);
  try {
    return JSON.parse(stdout.toString("utf-8"));
  } catch {
    throw new AppError("INTERNAL_ERROR", "Failed to parse media metadata.", 500);
  }
}

export function spawnYtDlpStream(url: string, formatId: string) {
  return spawn(
    env.pythonPath,
    [
      "-m", "yt_dlp",
      "-f", formatId,
      "--no-warnings",
      "--no-playlist",
      "--no-part",
      ...youtubeAuthArgs(), ...JS_RUNTIME_ARGS,
      "-o", "-",
      url,
    ],
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
      ...youtubeAuthArgs(), ...JS_RUNTIME_ARGS,
      ...ffmpegLocationArgs(ffmpegPath),
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
      ...youtubeAuthArgs(), ...JS_RUNTIME_ARGS,
      ...ffmpegLocationArgs(ffmpegPath),
      "-o", outFile,
      url,
    ],
    { windowsHide: true }
  );
}
