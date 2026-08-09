"use client";

import { useLocale } from "next-intl";
import { useTheme } from "@/components/theme/ThemeProvider";

const copy = {
  fr: {
    light: "Clair",
    dark: "Sombre",
    auto: "Auto",
    toggle: (mode: string) => `Thème : ${mode}. Cliquer pour changer`,
  },
  en: {
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    toggle: (mode: string) => `Theme: ${mode}. Click to change`,
  },
} as const;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = copy[locale === "en" ? "en" : "fr"];
  const { preference, theme, cyclePreference } = useTheme();

  const modeLabel =
    preference === "auto"
      ? `${t.auto} (${theme === "light" ? t.light : t.dark})`
      : preference === "light"
        ? t.light
        : t.dark;

  const showLight =
    preference === "light" || (preference === "auto" && theme === "light");

  return (
    <button
      type="button"
      onClick={cyclePreference}
      className={`inline-flex items-center gap-1.5 rounded-full border border-[color:var(--header-border)] bg-[color:var(--header-chip-bg)] px-2.5 py-2 text-[color:var(--header-fg)] transition-[background-color,border-color,color,transform] duration-200 hover:border-teal hover:text-teal active:scale-[0.96] ${className}`}
      aria-label={t.toggle(modeLabel)}
      title={t.toggle(modeLabel)}
    >
      <span className="relative h-4 w-4">
        <SunIcon
          className={`absolute inset-0 h-4 w-4 transition-[opacity,transform,filter] duration-200 ${
            showLight
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.25] opacity-0 blur-[4px]"
          }`}
        />
        <MoonIcon
          className={`absolute inset-0 h-4 w-4 transition-[opacity,transform,filter] duration-200 ${
            !showLight
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.25] opacity-0 blur-[4px]"
          }`}
        />
      </span>
      <span className="hidden text-xs font-semibold uppercase tracking-wide md:inline">
        {preference === "auto" ? t.auto : preference === "light" ? "Light" : "Dark"}
      </span>
    </button>
  );
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19 14.5A7.5 7.5 0 019.5 5 7.8 7.8 0 0011 19a7.8 7.8 0 008-4.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
