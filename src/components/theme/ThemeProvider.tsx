"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  THEME_PREF_KEY,
  msUntilNextThemeBoundary,
  parseThemePreference,
  resolveTheme,
  type Theme,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  theme: Theme;
  setPreference: (preference: ThemePreference) => void;
  cyclePreference: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(preference: ThemePreference) {
  const theme = resolveTheme(preference);
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-theme-pref", preference);
  root.style.colorScheme = theme;
  return theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("auto");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = parseThemePreference(localStorage.getItem(THEME_PREF_KEY));
    setPreferenceState(stored);
    setTheme(applyTheme(stored));
  }, []);

  useEffect(() => {
    if (preference !== "auto") return;

    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setTheme(applyTheme("auto"));
        schedule();
      }, msUntilNextThemeBoundary());
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    localStorage.setItem(THEME_PREF_KEY, next);
    setPreferenceState(next);
    setTheme(applyTheme(next));
  }, []);

  const cyclePreference = useCallback(() => {
    setPreferenceState((current) => {
      const order: ThemePreference[] = ["auto", "light", "dark"];
      const next = order[(order.indexOf(current) + 1) % order.length];
      localStorage.setItem(THEME_PREF_KEY, next);
      setTheme(applyTheme(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ preference, theme, setPreference, cyclePreference }),
    [preference, theme, setPreference, cyclePreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
