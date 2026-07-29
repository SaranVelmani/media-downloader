"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { MediaInfo } from "@/types/media";
import { downloadMedia } from "@/services/api";
import { formatBytes } from "@/utils/format";

const MP3_BITRATES = [128, 192, 256, 320] as const;

function safeTitle(title: string) {
  return title.replace(/[\\/:*?"<>|]/g, "_").slice(0, 60) || "download";
}

export function FormatTable({ media }: { media: MediaInfo }) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleVideoDownload(formatId: string, ext: string) {
    setPending(`video-${formatId}`);
    setError(null);
    try {
      await downloadMedia(
        { url: media.sourceUrl, type: "video", formatId },
        `${safeTitle(media.title)}.${ext}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setPending(null);
    }
  }

  async function handleAudioDownload(audioFormat: "mp3" | "m4a" | "wav" | "flac", key: string) {
    setPending(key);
    setError(null);
    try {
      await downloadMedia(
        { url: media.sourceUrl, type: "audio", audioFormat },
        `${safeTitle(media.title)}.${audioFormat}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mt-6 space-y-8">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/60">Video formats</h4>
        <div className="glass rounded-2xl">
          <table className="w-full table-fixed text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-surface-border/60 text-left text-foreground/60">
                <th className="w-[30%] px-2 py-3 font-medium sm:px-4">Resolution</th>
                <th className="w-[18%] px-2 py-3 font-medium sm:px-4">Ext</th>
                <th className="w-[22%] px-2 py-3 font-medium sm:px-4">Size</th>
                <th className="w-[30%] px-2 py-3 font-medium sm:px-4" />
              </tr>
            </thead>
            <tbody>
              {media.videoFormats.map((f) => {
                const key = `video-${f.formatId}`;
                return (
                  <tr key={f.formatId} className="border-b border-surface-border/30 last:border-0">
                    <td className="truncate px-2 py-3 font-medium sm:px-4">{f.resolution}</td>
                    <td className="truncate px-2 py-3 uppercase text-foreground/70 sm:px-4">{f.ext}</td>
                    <td className="truncate px-2 py-3 text-foreground/70 sm:px-4">{formatBytes(f.filesizeBytes)}</td>
                    <td className="px-2 py-3 text-right sm:px-4">
                      <button
                        onClick={() => handleVideoDownload(f.formatId, f.ext)}
                        disabled={pending === key}
                        className="inline-flex items-center gap-1 rounded-full bg-violet-500 px-2.5 py-1.5 text-[11px] font-medium text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-60 sm:gap-1.5 sm:px-3 sm:text-xs"
                      >
                        {pending === key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {media.videoFormats.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-foreground/50">
                    No video formats available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/60">Audio formats</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="glass rounded-2xl p-4">
            <p className="mb-3 text-sm font-medium">Extract as MP3</p>
            <div className="flex flex-wrap justify-center gap-2">
              {MP3_BITRATES.map((bitrate) => {
                const key = `mp3-${bitrate}`;
                return (
                  <button
                    key={bitrate}
                    onClick={() => handleAudioDownload("mp3", key)}
                    disabled={pending === key}
                    className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
                  >
                    {pending === key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    {bitrate}kbps
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="mb-3 text-sm font-medium">Other formats</p>
            <div className="flex flex-wrap justify-center gap-2">
              {(["m4a", "wav", "flac"] as const).map((fmt) => {
                const key = `audio-${fmt}`;
                return (
                  <button
                    key={fmt}
                    onClick={() => handleAudioDownload(fmt, key)}
                    disabled={pending === key}
                    className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium uppercase transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
                  >
                    {pending === key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    {fmt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
