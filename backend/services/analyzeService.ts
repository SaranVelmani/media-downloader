import { MediaInfo } from "../types/media";
import { resolveProvider } from "./providers/registry";

export async function analyzeUrl(url: string): Promise<MediaInfo> {
  const provider = resolveProvider(url);
  return provider.analyze(url);
}
