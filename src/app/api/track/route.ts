import { NextResponse } from "next/server";
import { appendJsonl } from "@/lib/storage";
import type { TrackEvent, TrackEventType } from "@/lib/analytics-types";

const ALLOWED_TYPES: TrackEventType[] = [
  "pageview",
  "click",
  "scroll",
  "identify",
  "heartbeat",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<TrackEvent>;

    const visitorId = body.visitorId?.trim() ?? "";
    const sessionId = body.sessionId?.trim() ?? "";
    const type = body.type;
    const path = body.path?.trim() ?? "";

    if (
      !visitorId ||
      !sessionId ||
      !path ||
      !type ||
      !ALLOWED_TYPES.includes(type)
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_payload" },
        { status: 400 },
      );
    }

    // Never accept identify without an email shape; email only from voluntary forms
    if (type === "identify") {
      return NextResponse.json(
        { ok: false, error: "identify_via_forms_only" },
        { status: 400 },
      );
    }

    const event: TrackEvent = {
      visitorId: visitorId.slice(0, 80),
      sessionId: sessionId.slice(0, 80),
      type,
      path: path.slice(0, 500),
      locale: body.locale?.slice(0, 10),
      label: body.label?.slice(0, 200),
      href: body.href?.slice(0, 500),
      scrollDepth:
        typeof body.scrollDepth === "number"
          ? Math.min(100, Math.max(0, Math.round(body.scrollDepth)))
          : undefined,
      referrer: body.referrer?.slice(0, 500),
      userAgent: request.headers.get("user-agent")?.slice(0, 300),
      ts: new Date().toISOString(),
    };

    await appendJsonl("analytics/events.jsonl", event);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 },
    );
  }
}
