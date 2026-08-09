import { NextResponse } from "next/server";
import { appendJsonl } from "@/lib/storage";
import { createId } from "@/lib/id";
import { sendNewsletterNotification } from "@/lib/mail";
import type { LeadRecord } from "@/lib/analytics-types";

type NewsletterPayload = {
  email?: string;
  visitorId?: string;
  sessionId?: string;
  locale?: string;
  consent?: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NewsletterPayload;
    const email = body.email?.trim().toLowerCase() ?? "";
    const consent = Boolean(body.consent);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400 },
      );
    }

    if (!consent) {
      return NextResponse.json(
        { ok: false, error: "consent_required" },
        { status: 400 },
      );
    }

    const lead: LeadRecord = {
      id: createId("lead"),
      source: "newsletter",
      email,
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
        path: "/newsletter",
        locale: lead.locale,
        email: lead.email,
        ts: lead.createdAt,
      });
    }

    try {
      await sendNewsletterNotification({
        email,
        locale: lead.locale,
      });
    } catch (error) {
      console.error("[newsletter] smtp_failed", error);
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
