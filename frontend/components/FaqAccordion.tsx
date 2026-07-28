"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Which platforms are supported?",
    a: "YouTube and Instagram today, with the provider system built so more platforms can be added without frontend changes.",
  },
  {
    q: "Do I need to log in?",
    a: "No. Paste a public media URL and download — no account required.",
  },
  {
    q: "Can I download private or age-restricted content?",
    a: "No. Only publicly accessible media you have the right to download is supported. Private, removed, or restricted content returns a clear error instead.",
  },
  {
    q: "What formats can I download?",
    a: "Whatever formats the source publishes — typically several video resolutions plus audio-only tracks you can extract as MP3, M4A, WAV, or FLAC.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6" id="faq">
      <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Frequently asked questions</h2>
      <div className="mt-8 space-y-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="glass overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
                aria-expanded={isOpen}
              >
                {item.q}
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-5 pb-4 text-sm text-foreground/70">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
