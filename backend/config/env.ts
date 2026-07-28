import path from "path";

function findFfmpeg(): string {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  if (process.platform === "win32") {
    return "C:\\Users\\vsara\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.2-full_build\\bin\\ffmpeg.exe";
  }
  return "ffmpeg";
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:3000,http://localhost:3001").split(","),
  pythonPath: process.env.PYTHON_PATH ?? "python",
  ffmpegPath: findFfmpeg(),
  tempDir: process.env.TEMP_DIR ?? path.join(process.cwd(), ".tmp"),
  rateLimitWindowMs: 60_000,
  rateLimitMax: 30,
  requestTimeoutMs: 30_000,
};
