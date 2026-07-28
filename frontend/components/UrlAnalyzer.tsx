"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle, RotateCcw } from "lucide-react";
import { useAnalyzeMedia } from "@/hooks/useAnalyzeMedia";
import { validateMediaUrl } from "@/utils/validateUrl";
import { ApiRequestError } from "@/services/api";
import { PreviewCard } from "./PreviewCard";
import { FormatTable } from "./FormatTable";

const LOADING_PHRASES = ["Analyzing...", "Fetching metadata...", "Almost there..."];

interface FormValues {
  url: string;
}

export function UrlAnalyzer() {
  const { register, handleSubmit, formState, setError, clearErrors } = useForm<FormValues>({ defaultValues: { url: "" } });
  const mutation = useAnalyzeMedia();
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (!mutation.isPending) return;
    setPhraseIndex(0);
    const interval = setInterval(() => setPhraseIndex((i) => (i + 1) % LOADING_PHRASES.length), 1200);
    return () => clearInterval(interval);
  }, [mutation.isPending]);

  function onSubmit(values: FormValues) {
    clearErrors("url");
    const validation = validateMediaUrl(values.url);
    if (!validation.valid) {
      const messages = {
        empty: "Please paste a media URL.",
        invalid: "That doesn't look like a valid URL.",
        unsupported: "Only Instagram and YouTube URLs are supported right now.",
      };
      setError("url", { message: messages[validation.reason] });
      return;
    }
    mutation.mutate(values.url);
  }

  const apiErrorMessage =
    mutation.error instanceof ApiRequestError ? mutation.error.message : mutation.error ? "Something went wrong." : null;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="glass flex flex-col gap-3 rounded-2xl p-2 shadow-sm sm:flex-row">
        <div className="flex flex-1 items-center gap-2 px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-foreground/40" />
          <input
            {...register("url")}
            placeholder="Paste Instagram or YouTube URL..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
        >
          {mutation.isPending ? LOADING_PHRASES[phraseIndex] : "Analyze"}
        </button>
      </form>

      <AnimatePresence>
        {formState.errors.url && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 flex items-center gap-1.5 text-sm text-red-500"
          >
            <AlertCircle className="h-3.5 w-3.5" /> {formState.errors.url.message}
          </motion.p>
        )}

        {apiErrorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
          >
            <span className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" /> {apiErrorMessage}
            </span>
            <button
              onClick={() => handleSubmit(onSubmit)()}
              className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium hover:bg-red-500/20"
            >
              <RotateCcw className="h-3 w-3" /> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mutation.data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6">
            <PreviewCard media={mutation.data} />
            <FormatTable media={mutation.data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
