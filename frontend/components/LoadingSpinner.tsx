"use client";

import { motion } from "framer-motion";

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-foreground/70">
      <motion.span
        className="h-4 w-4 rounded-full border-2 border-foreground/20 border-t-violet-500"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
      {label && <span>{label}</span>}
    </div>
  );
}
