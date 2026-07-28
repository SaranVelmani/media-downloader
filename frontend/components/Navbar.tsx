"use client";

import Link from "next/link";
import { Download, Github } from "lucide-react";
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
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white">
              <Download className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">Media Downloader</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/70 md:flex">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 items-center gap-2 rounded-full glass px-3 text-sm font-medium transition-transform hover:scale-105 active:scale-95 sm:flex"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
