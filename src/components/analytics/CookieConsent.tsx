"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CONSENT_STORAGE_KEY, parseConsent } from "@/lib/consent";

export function CookieConsent() {
  const t = useTranslations("Consent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
    setVisible(!existing);
  }, []);

  function decide(analytics: boolean) {
    const payload = {
      analytics,
      decidedAt: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new Event("hm:consent-updated"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-[80] p-3 sm:p-5">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-line bg-white/95 p-3.5 shadow-[0_20px_60px_rgba(7,26,61,0.18)] backdrop-blur sm:gap-4 sm:p-4 md:flex-row md:items-end md:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-navy">{t("title")}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate sm:text-sm">
            {t("text")}{" "}
            <Link
              href="/confidentialite"
              className="font-semibold text-teal-dark underline-offset-2 hover:underline"
            >
              {t("privacyLink")}
            </Link>
            .
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:flex-row">
          <button
            type="button"
            onClick={() => decide(false)}
            className="rounded-full border border-line px-3 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-mist sm:px-4"
          >
            {t("refuse")}
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="rounded-full bg-navy px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-soft sm:px-4"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
