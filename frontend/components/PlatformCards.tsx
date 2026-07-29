"use client";

import { motion } from "framer-motion";
import { Instagram, Youtube, Clock } from "lucide-react";

const SUPPORTED = [
  { name: "Instagram", icon: Instagram, status: "Supported" },
  { name: "YouTube", icon: Youtube, status: "Supported" },
];

const COMING_SOON = ["Facebook", "Snapchat"];

export function PlatformCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" id="platforms">
      <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Supported platforms</h2>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {SUPPORTED.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass flex flex-col items-center gap-3 rounded-2xl p-6 shadow-sm"
          >
            <p.icon className="h-8 w-8 text-violet-500" />
            <span className="font-medium">{p.name}</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
              {p.status}
            </span>
          </motion.div>
        ))}
        {COMING_SOON.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (SUPPORTED.length + i) * 0.05 }}
            className="glass flex flex-col items-center gap-3 rounded-2xl p-6 opacity-60 shadow-sm"
          >
            <Clock className="h-8 w-8" />
            <span className="font-medium">{name}</span>
            <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium">Coming soon</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
