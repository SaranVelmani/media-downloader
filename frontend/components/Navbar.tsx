"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="glass flex w-full items-center justify-between rounded-2xl px-4 py-2.5 shadow-sm sm:px-5">
          <Link href="#home" className="flex items-center gap-2 font-semibold tracking-tight">
            <motion.span
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.15, rotate: -8 }}
              whileTap={{ scale: 0.9 }}
            >
              <Download className="h-4 w-4" />
            </motion.span>
            <span className="text-sm sm:text-base">M-Downloader</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/70 md:flex">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
