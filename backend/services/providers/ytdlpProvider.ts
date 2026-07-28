import { MediaProvider } from "./provider";
import { AudioFormat, MediaInfo, Platform, VideoFormat } from "../../types/media";
import { fetchMetadataJson } from "../../download/ytdlp";

function toVideoFormats(raw: any[]): VideoFormat[] {
  return raw
    .filter((f) => f.vcodec && f.vcodec !== "none")
    .map((f) => ({
      formatId: String(f.format_id),
      ext: f.ext,
      resolution: f.resolution ?? (f.height ? `${f.height}p` : "unknown"),
      height: f.height ?? null,
      fps: f.fps ?? null,
      vcodec: f.vcodec ?? null,
      acodec: f.acodec ?? null,
      hdr: typeof f.dynamic_range === "string" && f.dynamic_range !== "SDR",
      filesizeBytes: f.filesize ?? f.filesize_approx ?? null,
      hasAudio: !!(f.acodec && f.acodec !== "none"),
    }))
    .sort((a, b) => (b.height ?? 0) - (a.height ?? 0));
}

function toAudioFormats(raw: any[]): AudioFormat[] {
  return raw
    .filter((f) => (!f.vcodec || f.vcodec === "none") && f.acodec && f.acodec !== "none")
    .map((f) => ({
      formatId: String(f.format_id),
      ext: f.ext,
      acodec: f.acodec ?? null,
      abrKbps: f.abr ?? null,
      filesizeBytes: f.filesize ?? f.filesize_approx ?? null,
    }))
    .sort((a, b) => (b.abrKbps ?? 0) - (a.abrKbps ?? 0));
}

export function makeYtDlpProvider(platform: Platform, matches: (url: string) => boolean): MediaProvider {
  return {
    platform,
    matches,
    async analyze(url: string): Promise<MediaInfo> {
      const data = await fetchMetadataJson(url);
      const formats: any[] = data.formats ?? [];
      return {
        platform,
        sourceUrl: url,
        id: String(data.id ?? ""),
        title: data.title ?? "Untitled",
        thumbnail: data.thumbnail ?? null,
        uploader: data.uploader ?? data.channel ?? data.uploader_id ?? null,
        duration: data.duration ?? null,
        views: data.view_count ?? null,
        uploadDate: data.upload_date ?? null,
        resolution: data.resolution ?? (data.height ? `${data.height}p` : null),
        videoFormats: toVideoFormats(formats),
        audioFormats: toAudioFormats(formats),
      };
    },
  };
}
