export type Theme = "light" | "dark";
export type ThemePreference = "auto" | Theme;

export const THEME_PREF_KEY = "hm_theme_pref";

/** Light: 06:00–18:59 · Dark: 19:00–05:59 (heure locale) */
export function getAutoTheme(date = new Date()): Theme {
  const hour = date.getHours();
  return hour >= 6 && hour < 19 ? "light" : "dark";
}

export function resolveTheme(preference: ThemePreference, date = new Date()): Theme {
  return preference === "auto" ? getAutoTheme(date) : preference;
}

export function parseThemePreference(raw: string | null): ThemePreference {
  if (raw === "light" || raw === "dark" || raw === "auto") return raw;
  return "auto";
}

export function msUntilNextThemeBoundary(date = new Date()) {
  const next = new Date(date);
  next.setSeconds(0, 0);
  next.setMinutes(0);

  const hour = date.getHours();
  if (hour >= 6 && hour < 19) {
    next.setHours(19, 0, 0, 0);
  } else if (hour < 6) {
    next.setHours(6, 0, 0, 0);
  } else {
    next.setDate(next.getDate() + 1);
    next.setHours(6, 0, 0, 0);
  }

  return Math.max(1000, next.getTime() - date.getTime());
}
