import { MediaInfo } from "@/types/media";

// Vercel's dashboard-configured NEXT_PUBLIC_API_URL is injected directly into
// process.env and always wins over any .env file value with the same name,
// so a one-off override needs its own var name to actually take effect.
const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiRequestError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

async function parseErrorResponse(res: Response): Promise<never> {
  let code = "NETWORK_ERROR";
  let message = "Something went wrong. Please try again.";
  try {
    const data = await res.json();
    code = data?.error?.code ?? code;
    message = data?.error?.message ?? message;
  } catch {
    // response wasn't JSON, keep defaults
  }
  throw new ApiRequestError(code, message);
}

export async function analyzeMedia(url: string): Promise<MediaInfo> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) await parseErrorResponse(res);
  return res.json();
}

export interface DownloadParams {
  url: string;
  type: "video" | "audio";
  formatId?: string;
  audioFormat?: "mp3" | "m4a" | "wav" | "flac";
}

export async function downloadMedia(params: DownloadParams, suggestedName: string): Promise<void> {
  const res = await fetch(`${API_BASE}/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) await parseErrorResponse(res);

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = suggestedName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
