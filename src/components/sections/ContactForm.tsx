"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/Icons";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { getTrackingIds } from "@/components/analytics/visitor";

type Status = "idle" | "loading" | "success" | "error";

const fieldClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-navy outline-none transition-[border-color,box-shadow] placeholder:text-slate/50 focus:border-teal focus:shadow-[0_0_0_3px_rgba(0,194,204,0.15)]";

export function ContactForm() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const consentPrivacy = data.get("consentPrivacy") === "yes";
    const { visitorId, sessionId } = getTrackingIds();

    if (!name || !email || !subject || !message || !consentPrivacy) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          subject,
          message,
          consentPrivacy,
          visitorId,
          sessionId,
          locale,
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "request_failed");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold text-navy">
              {t("name")} *
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder={t("namePlaceholder")}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-navy">
              {t("email")} *
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-semibold text-navy">
              {t("phone")}
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder={t("phonePlaceholder")}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="contact-company" className="mb-1.5 block text-sm font-semibold text-navy">
              {t("company")}
            </label>
            <input
              id="contact-company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder={t("companyPlaceholder")}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-semibold text-navy">
            {t("subject")} *
          </label>
          <select
            id="contact-subject"
            name="subject"
            required
            defaultValue=""
            className={fieldClass}
          >
            <option value="" disabled>
              {t("subjectPlaceholder")}
            </option>
            <option value="partnership">{t("subjects.partnership")}</option>
            <option value="services">{t("subjects.services")}</option>
            <option value="products">{t("subjects.products")}</option>
            <option value="training">{t("subjects.training")}</option>
            <option value="other">{t("subjects.other")}</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-navy">
            {t("message")} *
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder={t("messagePlaceholder")}
            className={`${fieldClass} resize-y min-h-[140px]`}
          />
        </div>

        <label className="flex items-start gap-2.5 text-sm leading-relaxed text-slate">
          <input
            type="checkbox"
            name="consentPrivacy"
            value="yes"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-teal"
          />
          <span>
            {t("consent")}{" "}
            <Link
              href="/confidentialite"
              className="font-semibold text-teal-dark underline-offset-2 hover:underline"
            >
              {t("privacyLink")}
            </Link>
            .
          </span>
        </label>

        {status === "error" && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {t("error")}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(7,26,61,0.25)] transition-[transform,background-color] hover:bg-navy-soft active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? t("sending") : t("submit")}
          {status !== "loading" && <ArrowRight className="h-4 w-4 text-teal" />}
        </button>
      </form>

      <SuccessModal
        open={status === "success"}
        title={locale === "en" ? "Message sent" : "Message envoyé"}
        message={
          locale === "en"
            ? "Thank you! Your message has been sent. We will get back to you shortly."
            : "Merci ! Votre message a bien été envoyé. Nous vous recontactons rapidement."
        }
        closeLabel={locale === "en" ? "Close" : "Fermer"}
        onClose={() => setStatus("idle")}
      />
    </>
  );
}
