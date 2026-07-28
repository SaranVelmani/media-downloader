"use client";

import { motion } from "framer-motion";
import { Zap, MonitorPlay, AudioLines, FileStack, ShieldCheck, LockKeyhole } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Lightning Fast", desc: "Optimized streaming pipeline gets you your file in seconds." },
  { icon: MonitorPlay, title: "HD Downloads", desc: "Grab video in the highest resolution the source offers." },
  { icon: AudioLines, title: "Audio Extraction", desc: "Pull clean audio-only tracks in MP3, M4A, and more." },
  { icon: FileStack, title: "Multiple Formats", desc: "Choose the exact container and quality you need." },
  { icon: ShieldCheck, title: "No Login Required", desc: "Paste a public URL and go — no account needed." },
  { icon: LockKeyhole, title: "Secure Processing", desc: "Requests are rate-limited, sanitized, and never stored." },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" id="features">
      <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Why Media Downloader</h2>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-6 shadow-sm"
          >
            <f.icon className="h-6 w-6 text-violet-500" />
            <h3 className="mt-3 font-medium">{f.title}</h3>
            <p className="mt-1 text-sm text-foreground/70">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
