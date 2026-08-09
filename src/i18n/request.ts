import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import frMessages from "../../messages/fr.json";
import enMessages from "../../messages/en.json";

// Clone catalogs so Turbopack picks up message JSON updates reliably
const catalogs = {
  fr: structuredClone(frMessages),
  en: structuredClone(enMessages),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: catalogs[locale as keyof typeof catalogs],
  };
});
