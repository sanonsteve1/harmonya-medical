import { NextResponse } from "next/server";
import { appendJsonl } from "@/lib/storage";
import { createId } from "@/lib/id";
import { sendContactNotification } from "@/lib/mail";
import type { LeadRecord } from "@/lib/analytics-types";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
  visitorId?: string;
  sessionId?: string;
  locale?: string;
  consentPrivacy?: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const message = body.message?.trim() ?? "";
    const subject = body.subject?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const company = body.company?.trim() ?? "";

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

    if (!body.consentPrivacy) {
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
      visitorId: body.visitorId?.slice(0, 80),
      sessionId: body.sessionId?.slice(0, 80),
      locale: body.locale?.slice(0, 10),
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
