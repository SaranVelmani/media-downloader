import { useMutation } from "@tanstack/react-query";
import { analyzeMedia } from "@/services/api";

export function useAnalyzeMedia() {
  return useMutation({
    mutationFn: (url: string) => analyzeMedia(url),
  });
}
