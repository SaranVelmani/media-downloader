"use client";

import { motion } from "framer-motion";
import { UrlAnalyzer } from "./UrlAnalyzer";

export function Hero() {
  return (
    <section id="home" className="mx-auto max-w-4xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold tracking-tight sm:text-6xl"
      >
        Download Videos &amp; Audio in{" "}
        <motion.span
          className="inline-block bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500 bg-clip-text text-transparent"
          style={{ backgroundSize: "200% auto" }}
          animate={{ backgroundPosition: ["0% center", "200% center"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          Seconds
        </motion.span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mt-4 max-w-xl text-base text-foreground/70 sm:text-lg"
      >
        Paste a supported media URL and download available formats.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10"
      >
        <UrlAnalyzer />
      </motion.div>
    </section>
  );
}
