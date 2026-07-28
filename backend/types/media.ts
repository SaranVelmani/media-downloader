export type Platform = "youtube" | "instagram";

export interface VideoFormat {
  formatId: string;
  ext: string;
  resolution: string;
  height: number | null;
  fps: number | null;
  vcodec: string | null;
  acodec: string | null;
  hdr: boolean;
  filesizeBytes: number | null;
  hasAudio: boolean;
}

export interface AudioFormat {
  formatId: string;
  ext: string;
  acodec: string | null;
  abrKbps: number | null;
  filesizeBytes: number | null;
}

export interface MediaInfo {
  platform: Platform;
  sourceUrl: string;
  id: string;
  title: string;
  thumbnail: string | null;
  uploader: string | null;
  duration: number | null;
  views: number | null;
  uploadDate: string | null;
  resolution: string | null;
  videoFormats: VideoFormat[];
  audioFormats: AudioFormat[];
}
