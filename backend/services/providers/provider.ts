import { MediaInfo, Platform } from "../../types/media";

export interface MediaProvider {
  platform: Platform;
  matches(url: string): boolean;
  analyze(url: string): Promise<MediaInfo>;
}
