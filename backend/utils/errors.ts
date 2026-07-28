export type ErrorCode =
  | "EMPTY_URL"
  | "INVALID_URL"
  | "UNSUPPORTED_PLATFORM"
  | "PRIVATE_MEDIA"
  | "AGE_RESTRICTED"
  | "REMOVED_CONTENT"
  | "REGION_RESTRICTED"
  | "NETWORK_ERROR"
  | "CONVERSION_FAILED"
  | "TIMEOUT"
  | "SERVER_BUSY"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  code: ErrorCode;
  status: number;

  constructor(code: ErrorCode, message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "AppError";
  }
}

const PATTERNS: Array<{ test: RegExp; code: ErrorCode; status: number; message: string }> = [
  { test: /private video|private account|login required|sign in to confirm your age/i, code: "AGE_RESTRICTED", status: 403, message: "This media is age-restricted and requires sign-in to view." },
  { test: /private/i, code: "PRIVATE_MEDIA", status: 403, message: "This media is private and cannot be accessed." },
  { test: /video unavailable|has been removed|account.*terminated|content isn.?t available/i, code: "REMOVED_CONTENT", status: 404, message: "This media has been removed or is no longer available." },
  { test: /not available in your country|blocked it in your country|region/i, code: "REGION_RESTRICTED", status: 403, message: "This media is not available in your region." },
  { test: /unsupported url|no extractor found/i, code: "UNSUPPORTED_PLATFORM", status: 400, message: "This URL is not from a supported platform." },
];

export function classifyProviderError(rawMessage: string): AppError {
  for (const p of PATTERNS) {
    if (p.test.test(rawMessage)) {
      return new AppError(p.code, p.message, p.status);
    }
  }
  return new AppError("NETWORK_ERROR", "Failed to fetch media. The source may be temporarily unavailable.", 502);
}
