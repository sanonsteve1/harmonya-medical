"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { GlobeIcon } from "@/components/ui/Icons";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const switchLocale = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
      setOpen(false);
    });
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="inline-flex items-center gap-1 rounded-full px-1.5 py-2 text-sm font-semibold text-[color:var(--header-muted)] transition-colors hover:text-teal disabled:opacity-60 sm:gap-1.5 sm:px-2 sm:text-base"
        aria-label={t("changeLanguage")}
        aria-expanded={open}
      >
        <GlobeIcon className="h-5 w-5" />
        {locale.toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[96px] overflow-hidden rounded-xl border border-[color:var(--header-border)] bg-[color:var(--header-menu-bg)] py-1 shadow-xl backdrop-blur-xl">
          {routing.locales.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => switchLocale(item)}
              className={`block w-full px-4 py-2 text-left text-sm font-semibold transition-colors ${
                item === locale
                  ? "bg-teal/20 text-teal-dark"
                  : "text-[color:var(--header-fg)] hover:bg-teal/10 hover:text-teal"
              }`}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
