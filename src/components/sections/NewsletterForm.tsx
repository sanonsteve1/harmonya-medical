"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getTrackingIds } from "@/components/analytics/visitor";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const t = useTranslations("Newsletter");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const data = new FormData(form);
    const { visitorId, sessionId } = getTrackingIds();

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          consent: data.get("consent") === "on",
          visitorId,
          sessionId,
          locale,
        }),
      });

      if (!response.ok) throw new Error("fail");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <label htmlFor="newsletter-email" className="sr-only">
        {t("email")}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("placeholder")}
          className="w-full rounded-full border border-[color:var(--inverse-border)] bg-[color:var(--inverse-soft)] px-4 py-2.5 text-sm theme-fg outline-none placeholder:opacity-50 focus:border-teal"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-navy-deep transition-[transform,background-color] hover:bg-white hover:text-navy active:scale-[0.96] disabled:opacity-70"
        >
          {status === "loading" ? t("sending") : t("submit")}
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs leading-relaxed theme-muted">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 accent-teal"
        />
        <span>
          {t("consent")}{" "}
          <Link href="/confidentialite" className="text-teal hover:underline">
            {t("privacyLink")}
          </Link>
          .
        </span>
      </label>
      {status === "success" && (
        <p className="text-xs font-medium text-teal">{t("success")}</p>
      )}
      {status === "error" && (
        <p className="text-xs font-medium text-red-500">{t("error")}</p>
      )}
    </form>
  );
}
