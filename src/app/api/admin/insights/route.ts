import { NextResponse } from "next/server";
import { readJsonl } from "@/lib/storage";
import type { LeadRecord, TrackEvent } from "@/lib/analytics-types";

function getAdminKey() {
  return process.env.ANALYTICS_ADMIN_KEY || "harmonya-dev-key";
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function lastNDays(n: number) {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key") ?? "";

  if (key !== getAdminKey()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const events = await readJsonl<TrackEvent>("analytics/events.jsonl");
  const leads = await readJsonl<LeadRecord>("leads/leads.jsonl");

  const visitors = new Set(events.map((e) => e.visitorId));
  const sessions = new Set(events.map((e) => e.sessionId));
  const pageviews = events.filter((e) => e.type === "pageview");
  const clicks = events.filter((e) => e.type === "click");
  const scrolls = events.filter((e) => e.type === "scroll");

  const pages: Record<string, number> = {};
  for (const event of pageviews) {
    pages[event.path] = (pages[event.path] ?? 0) + 1;
  }

  const topPages = Object.entries(pages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  const clickLabels: Record<string, number> = {};
  for (const event of clicks) {
    const label = (event.label || event.href || "click").slice(0, 80);
    clickLabels[label] = (clickLabels[label] ?? 0) + 1;
  }
  const topClicks = Object.entries(clickLabels)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, count]) => ({ label, count }));

  const byType: Record<string, number> = {};
  for (const event of events) {
    byType[event.type] = (byType[event.type] ?? 0) + 1;
  }

  const byLocale: Record<string, number> = {};
  for (const event of pageviews) {
    const locale = event.locale || "—";
    byLocale[locale] = (byLocale[locale] ?? 0) + 1;
  }

  const days = lastNDays(14);
  const timelineMap: Record<
    string,
    { date: string; pageviews: number; events: number; leads: number }
  > = {};
  for (const date of days) {
    timelineMap[date] = { date, pageviews: 0, events: 0, leads: 0 };
  }
  for (const event of events) {
    const keyDay = dayKey(event.ts);
    if (!timelineMap[keyDay]) continue;
    timelineMap[keyDay].events += 1;
    if (event.type === "pageview") timelineMap[keyDay].pageviews += 1;
  }
  for (const lead of leads) {
    const keyDay = dayKey(lead.createdAt);
    if (!timelineMap[keyDay]) continue;
    timelineMap[keyDay].leads += 1;
  }
  const timeline = days.map((date) => timelineMap[date]);

  const scrollBuckets = { "25": 0, "50": 0, "75": 0, "100": 0 };
  for (const event of scrolls) {
    const depth = String(event.scrollDepth ?? "") as keyof typeof scrollBuckets;
    if (depth in scrollBuckets) scrollBuckets[depth] += 1;
  }

  const identified = events
    .filter((e) => e.type === "identify" && e.email)
    .reduce<
      Record<
        string,
        { email: string; visitorId: string; ts: string; path?: string }
      >
    >((acc, event) => {
      if (!event.email) return acc;
      acc[event.email] = {
        email: event.email,
        visitorId: event.visitorId,
        ts: event.ts,
        path: event.path,
      };
      return acc;
    }, {});

  // Build journeys per session (last 20 active sessions)
  const bySession: Record<string, TrackEvent[]> = {};
  for (const event of events) {
    if (!bySession[event.sessionId]) bySession[event.sessionId] = [];
    bySession[event.sessionId].push(event);
  }

  const journeys = Object.entries(bySession)
    .map(([sessionId, list]) => {
      const sorted = list
        .slice()
        .sort((a, b) => a.ts.localeCompare(b.ts));
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const pathTrail = sorted
        .filter((e) => e.type === "pageview")
        .map((e) => e.path);
      const identifiedEmail = sorted.find((e) => e.email)?.email;
      return {
        sessionId,
        visitorId: first?.visitorId ?? "",
        startedAt: first?.ts ?? "",
        lastSeenAt: last?.ts ?? "",
        eventCount: sorted.length,
        pageviews: pathTrail.length,
        paths: pathTrail.slice(0, 12),
        email: identifiedEmail,
        locale: first?.locale,
      };
    })
    .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))
    .slice(0, 20);

  const conversionRate =
    visitors.size > 0
      ? Math.round((leads.length / visitors.size) * 1000) / 10
      : 0;
  const avgEventsPerSession =
    sessions.size > 0
      ? Math.round((events.length / sessions.size) * 10) / 10
      : 0;

  const now = Date.now();
  const last24h = events.filter(
    (e) => now - new Date(e.ts).getTime() < 24 * 60 * 60 * 1000,
  ).length;
  const lastHour = events.filter(
    (e) => now - new Date(e.ts).getTime() < 60 * 60 * 1000,
  ).length;

  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    summary: {
      uniqueVisitors: visitors.size,
      sessions: sessions.size,
      pageviews: pageviews.length,
      events: events.length,
      leads: leads.length,
      identifiedEmails: Object.keys(identified).length,
      clicks: clicks.length,
      conversionRate,
      avgEventsPerSession,
      last24h,
      lastHour,
    },
    timeline,
    byType: Object.entries(byType)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count })),
    byLocale: Object.entries(byLocale)
      .sort((a, b) => b[1] - a[1])
      .map(([locale, count]) => ({ locale, count })),
    scrollDepth: Object.entries(scrollBuckets).map(([depth, count]) => ({
      depth: Number(depth),
      count,
    })),
    topPages,
    topClicks,
    journeys,
    recentEvents: events.slice(-80).reverse(),
    leads: leads.slice().reverse().slice(0, 100),
    identifiedEmails: Object.values(identified).sort((a, b) =>
      b.ts.localeCompare(a.ts),
    ),
  });
}
