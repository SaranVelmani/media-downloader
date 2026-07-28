const YOUTUBE_RE = /^https?:\/\/(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/i;
const INSTAGRAM_RE = /^https?:\/\/(www\.)?instagram\.com\/(reel|p|tv)\//i;

export type UrlValidation = { valid: true } | { valid: false; reason: "empty" | "invalid" | "unsupported" };

export function validateMediaUrl(raw: string): UrlValidation {
  const url = raw.trim();
  if (!url) return { valid: false, reason: "empty" };

  try {
    new URL(url);
  } catch {
    return { valid: false, reason: "invalid" };
  }

  if (!YOUTUBE_RE.test(url) && !INSTAGRAM_RE.test(url)) {
    return { valid: false, reason: "unsupported" };
  }

  return { valid: true };
}
