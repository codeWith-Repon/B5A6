import type { ColorMap } from "@/types/dashboard";

export const COLOR_MAP: Record<string, ColorMap> = {
  blue: {
    border: "border-blue-500/20",
    bg: "dark:bg-blue-500/5 bg-blue-500/12",
    accent: "text-blue-400",
  },
  amber: {
    border: "border-amber-500/20",
    bg: "dark:bg-amber-500/5 bg-amber-500/10",
    accent: "text-amber-400",
  },
  green: {
    border: "border-green-500/20",
    bg: "dark:bg-green-500/5 bg-green-500/12",
    accent: "text-green-400",
  },
  purple: {
    border: "border-purple-500/20",
    bg: "dark:bg-purple-500/5 bg-purple-500/12",
    accent: "text-purple-400",
  },
};