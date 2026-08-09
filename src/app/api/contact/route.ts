import { NextResponse } from "next/server";
import { appendJsonl } from "@/lib/storage";
import { createId } from "@/lib/id";
import { sendContactNotification } from "@/lib/mail";
import type { LeadRecord } from "@/lib/analytics-types";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  subject?: unknown;
  message?: unknown;
  visitorId?: unknown;
  sessionId?: unknown;
  locale?: unknown;
  consentPrivacy?: unknown;
};

function asString(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  return "";
}

function asConsent(value: unknown) {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true" ||
    value === "on" ||
    value === "yes"
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const name = asString(body.name);
    const email = asString(body.email).toLowerCase();
    const message = asString(body.message);
    const subject = asString(body.subject);
    const phone = asString(body.phone);
    const company = asString(body.company);
    const visitorId = asString(body.visitorId);
    const sessionId = asString(body.sessionId);
    const locale = asString(body.locale);
    const consentPrivacy = asConsent(body.consentPrivacy);

    if (!name || !email || !message || !subject) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400 },
      );
    }

    if (!consentPrivacy) {
      return NextResponse.json(
        { ok: false, error: "consent_required" },
        { status: 400 },
      );
    }

    const lead: LeadRecord = {
      id: createId("lead"),
      source: "contact",
      email,
      name,
      phone: phone || undefined,
      company: company || undefined,
      subject,
      message,
      visitorId: visitorId.slice(0, 80) || undefined,
      sessionId: sessionId.slice(0, 80) || undefined,
      locale: locale.slice(0, 10) || undefined,
      consentMarketing: true,
      createdAt: new Date().toISOString(),
    };

    await appendJsonl("leads/leads.jsonl", lead);

    if (lead.visitorId && lead.sessionId) {
      await appendJsonl("analytics/events.jsonl", {
        visitorId: lead.visitorId,
        sessionId: lead.sessionId,
        type: "identify",
        path: "/contact",
        locale: lead.locale,
        email: lead.email,
        label: subject,
        ts: lead.createdAt,
      });
    }

    try {
      await sendContactNotification({
        name,
        email,
        phone,
        company,
        subject,
        message,
        locale: lead.locale,
      });
    } catch (error) {
      console.error("[contact] smtp_failed", error);
      return NextResponse.json(
        { ok: false, error: "smtp_failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 },
    );
  }
}
