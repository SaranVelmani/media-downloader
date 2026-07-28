import { MediaProvider } from "./provider";
import { makeYtDlpProvider } from "./ytdlpProvider";
import { AppError } from "../../utils/errors";

const YOUTUBE_RE = /^https?:\/\/(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/i;
const INSTAGRAM_RE = /^https?:\/\/(www\.)?instagram\.com\/(reel|p|tv)\//i;

export const providers: MediaProvider[] = [
  makeYtDlpProvider("youtube", (url) => YOUTUBE_RE.test(url)),
  makeYtDlpProvider("instagram", (url) => INSTAGRAM_RE.test(url)),
];

export function resolveProvider(url: string): MediaProvider {
  const provider = providers.find((p) => p.matches(url));
  if (!provider) {
    throw new AppError("UNSUPPORTED_PLATFORM", "This URL is not from a supported platform (YouTube or Instagram).", 400);
  }
  return provider;
}
