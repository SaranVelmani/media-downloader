"use client";

import { motion } from "framer-motion";
import { Youtube, Instagram, Clock, Eye, Calendar, User, Monitor } from "lucide-react";
import { MediaInfo } from "@/types/media";
import { formatDuration, formatUploadDate, formatViews } from "@/utils/format";

const PLATFORM_ICON = { youtube: Youtube, instagram: Instagram };

export function PreviewCard({ media }: { media: MediaInfo }) {
  const Icon = PLATFORM_ICON[media.platform];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass overflow-hidden rounded-2xl shadow-sm"
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row">
        <div className="relative shrink-0 overflow-hidden rounded-xl sm:w-56">
          {media.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media.thumbnail} alt={media.title} className="h-40 w-full object-cover sm:h-32" />
          ) : (
            <div className="flex h-40 w-full items-center justify-center bg-foreground/5 sm:h-32">
              <Icon className="h-8 w-8 text-foreground/40" />
            </div>
          )}
          <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white">
            <Icon className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className="truncate text-lg font-semibold" title={media.title}>
            {media.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/70">
            {media.uploader && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {media.uploader}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {formatDuration(media.duration)}
            </span>
            {media.views !== null && (
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {formatViews(media.views)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {formatUploadDate(media.uploadDate)}
            </span>
            {media.resolution && (
              <span className="flex items-center gap-1">
                <Monitor className="h-3.5 w-3.5" /> {media.resolution}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
