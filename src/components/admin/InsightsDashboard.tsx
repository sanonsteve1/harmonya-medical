"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

type InsightsPayload = {
  generatedAt: string;
  summary: {
    uniqueVisitors: number;
    sessions: number;
    pageviews: number;
    events: number;
    leads: number;
    identifiedEmails: number;
    clicks: number;
    conversionRate: number;
    avgEventsPerSession: number;
    last24h: number;
    lastHour: number;
  };
  timeline: { date: string; pageviews: number; events: number; leads: number }[];
  byType: { type: string; count: number }[];
  byLocale: { locale: string; count: number }[];
  scrollDepth: { depth: number; count: number }[];
  topPages: { path: string; count: number }[];
  topClicks: { label: string; count: number }[];
  journeys: {
    sessionId: string;
    visitorId: string;
    startedAt: string;
    lastSeenAt: string;
    eventCount: number;
    pageviews: number;
    paths: string[];
    email?: string;
    locale?: string;
  }[];
  leads: {
    id: string;
    source: string;
    email: string;
    name?: string;
    company?: string;
    subject?: string;
    createdAt: string;
    visitorId?: string;
  }[];
  identifiedEmails: {
    email: string;
    visitorId: string;
    ts: string;
    path?: string;
  }[];
  recentEvents: {
    type: string;
    path: string;
    label?: string;
    ts: string;
    visitorId: string;
    scrollDepth?: number;
  }[];
};

type Tab = "overview" | "journeys" | "leads" | "live";

const KEY_STORAGE = "hm_admin_key";

export function InsightsDashboard() {
  const t = useTranslations("Insights");
  const locale = useLocale();
  const [key, setKey] = useState("");
  const [data, setData] = useState<InsightsPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const load = useCallback(
    async (adminKey: string, soft = false) => {
      if (!soft) setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `/api/admin/insights?key=${encodeURIComponent(adminKey)}`,
        );
        if (!response.ok) throw new Error("unauthorized");
        const json = (await response.json()) as InsightsPayload & {
          ok: boolean;
        };
        setData(json);
        sessionStorage.setItem(KEY_STORAGE, adminKey);
      } catch {
        setData(null);
        setError(t("error"));
      } finally {
        if (!soft) setLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORAGE);
    if (saved) {
      setKey(saved);
      void load(saved);
    }
  }, [load]);

  useEffect(() => {
    if (!autoRefresh || !key || !data) return;
    const id = window.setInterval(() => void load(key, true), 30000);
    return () => window.clearInterval(id);
  }, [autoRefresh, key, data, load]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await load(key);
  }

  const filteredLeads = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data.leads;
    return data.leads.filter((lead) =>
      [lead.email, lead.name, lead.company, lead.source, lead.subject]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q)),
    );
  }, [data, query]);

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  const dayFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
      }),
    [locale],
  );

  function exportLeads() {
    if (!data?.leads.length) return;
    const header = ["email", "source", "name", "company", "subject", "createdAt"];
    const rows = data.leads.map((lead) =>
      [
        lead.email,
        lead.source,
        lead.name ?? "",
        lead.company ?? "",
        lead.subject ?? "",
        lead.createdAt,
      ]
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `harmonya-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: t("tabs.overview") },
    { id: "journeys", label: t("tabs.journeys") },
    { id: "leads", label: t("tabs.leads") },
    { id: "live", label: t("tabs.live") },
  ];

  return (
    <section className="relative overflow-hidden pb-16 pt-28 lg:pb-24 lg:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] mesh-dark" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-40 [background:radial-gradient(ellipse_50%_60%_at_80%_20%,rgba(0,194,204,0.35),transparent_60%)]" />

      <Container className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl theme-fg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              {t("label")}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed theme-muted">
              {t("text")}
            </p>
          </div>

          {data && (
            <div className="flex flex-wrap items-center gap-3 text-xs theme-muted">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--inverse-border)] bg-[color:var(--inverse-soft)] px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
                </span>
                {t("liveBadge", { count: data.summary.lastHour })}
              </span>
              <span>
                {t("updated")} {dateFmt.format(new Date(data.generatedAt))}
              </span>
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="accent-teal"
                />
                {t("autoRefresh")}
              </label>
              <button
                type="button"
                onClick={() => void load(key, true)}
                className="rounded-full border border-[color:var(--inverse-border)] px-3 py-1.5 transition-colors hover:border-teal hover:text-teal"
              >
                {t("refresh")}
              </button>
            </div>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-[color:var(--inverse-border)] bg-[color:var(--inverse-soft)] p-3 backdrop-blur sm:flex-row sm:items-center"
        >
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={t("keyPlaceholder")}
            required
            className="w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-teal"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-navy-deep transition-[transform,background-color] hover:bg-white active:scale-[0.96] disabled:opacity-70"
          >
            {loading ? t("loading") : data ? t("reload") : t("submit")}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        {data && (
          <div className="mt-8 space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label={t("stats.visitors")}
                value={data.summary.uniqueVisitors}
                hint={t("hints.visitors", { count: data.summary.last24h })}
                accent
              />
              <StatCard
                label={t("stats.pageviews")}
                value={data.summary.pageviews}
                hint={t("hints.sessions", {
                  count: data.summary.sessions,
                })}
              />
              <StatCard
                label={t("stats.conversion")}
                value={`${data.summary.conversionRate}%`}
                hint={t("hints.leads", { count: data.summary.leads })}
              />
              <StatCard
                label={t("stats.engagement")}
                value={data.summary.avgEventsPerSession}
                hint={t("hints.clicks", { count: data.summary.clicks })}
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-line bg-white/90 p-1.5 shadow-[0_12px_40px_rgba(7,26,61,0.06)] sm:flex-wrap sm:gap-2 sm:p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition-[background-color,color,transform] active:scale-[0.96] sm:px-4 sm:text-sm ${
                    tab === item.id
                      ? "bg-navy text-white"
                      : "text-slate hover:bg-mist hover:text-navy"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {tab === "overview" && (
              <div className="grid gap-4 lg:grid-cols-12">
                <Panel
                  className="lg:col-span-8"
                  title={t("timeline")}
                  subtitle={t("timelineHint")}
                >
                  <ActivityChart
                    timeline={data.timeline}
                    dayFmt={dayFmt}
                    labels={{
                      pageviews: t("chart.pageviews"),
                      events: t("chart.events"),
                      leads: t("chart.leads"),
                    }}
                  />
                </Panel>

                <Panel
                  className="lg:col-span-4"
                  title={t("byType")}
                  subtitle={t("byTypeHint")}
                >
                  <BarList
                    items={data.byType.map((item) => ({
                      label: t(`types.${item.type}` as "types.pageview"),
                      value: item.count,
                    }))}
                    empty={t("empty")}
                  />
                </Panel>

                <Panel className="lg:col-span-6" title={t("topPages")}>
                  <BarList
                    items={data.topPages.map((item) => ({
                      label: item.path,
                      value: item.count,
                    }))}
                    empty={t("empty")}
                  />
                </Panel>

                <Panel className="lg:col-span-6" title={t("topClicks")}>
                  <BarList
                    items={data.topClicks.map((item) => ({
                      label: item.label,
                      value: item.count,
                    }))}
                    empty={t("empty")}
                  />
                </Panel>

                <Panel className="lg:col-span-6" title={t("scrollDepth")}>
                  <BarList
                    items={data.scrollDepth.map((item) => ({
                      label: `${item.depth}%`,
                      value: item.count,
                    }))}
                    empty={t("empty")}
                  />
                </Panel>

                <Panel className="lg:col-span-6" title={t("locales")}>
                  <BarList
                    items={data.byLocale.map((item) => ({
                      label: item.locale.toUpperCase(),
                      value: item.count,
                    }))}
                    empty={t("empty")}
                  />
                </Panel>
              </div>
            )}

            {tab === "journeys" && (
              <Panel title={t("journeysTitle")} subtitle={t("journeysHint")}>
                <div className="space-y-3">
                  {data.journeys.map((journey) => (
                    <article
                      key={journey.sessionId}
                      className="rounded-2xl border border-line/80 bg-mist/40 p-4 transition-[border-color,background-color] hover:border-teal/40 hover:bg-white"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-navy">
                            {journey.email || t("anonymousVisitor")}
                          </p>
                          <p className="mt-1 text-xs text-slate">
                            {dateFmt.format(new Date(journey.startedAt))} →{" "}
                            {dateFmt.format(new Date(journey.lastSeenAt))}
                            {journey.locale
                              ? ` · ${journey.locale.toUpperCase()}`
                              : ""}
                          </p>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <Chip>
                            {journey.pageviews} {t("pageviewsShort")}
                          </Chip>
                          <Chip>
                            {journey.eventCount} {t("eventsShort")}
                          </Chip>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {journey.paths.length === 0 && (
                          <span className="text-sm text-slate">{t("empty")}</span>
                        )}
                        {journey.paths.map((path, index) => (
                          <span key={`${journey.sessionId}-${path}-${index}`} className="contents">
                            <span className="rounded-lg bg-white px-2 py-1 text-xs font-medium text-navy shadow-sm outline outline-1 outline-black/5">
                              {path}
                            </span>
                            {index < journey.paths.length - 1 && (
                              <span className="text-teal">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                  {data.journeys.length === 0 && (
                    <EmptyState text={t("empty")} />
                  )}
                </div>
              </Panel>
            )}

            {tab === "leads" && (
              <div className="grid gap-4 lg:grid-cols-12">
                <Panel
                  className="lg:col-span-8"
                  title={t("leads")}
                  action={
                    <button
                      type="button"
                      onClick={exportLeads}
                      disabled={!data.leads.length}
                      className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-teal hover:bg-teal-soft disabled:opacity-40"
                    >
                      {t("export")}
                    </button>
                  }
                >
                  <div className="mb-4">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t("search")}
                      className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-navy outline-none focus:border-teal"
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="text-[11px] uppercase tracking-wide text-slate">
                        <tr>
                          <th className="pb-2 pr-4">{t("table.email")}</th>
                          <th className="pb-2 pr-4">{t("table.source")}</th>
                          <th className="pb-2 pr-4">{t("table.name")}</th>
                          <th className="pb-2">{t("table.date")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            className="border-t border-line/70 transition-colors hover:bg-mist/60"
                          >
                            <td className="py-3 pr-4">
                              <p className="font-semibold text-navy">
                                {lead.email}
                              </p>
                              {lead.company && (
                                <p className="text-xs text-slate">
                                  {lead.company}
                                </p>
                              )}
                            </td>
                            <td className="py-3 pr-4">
                              <Chip>{lead.source}</Chip>
                            </td>
                            <td className="py-3 pr-4 text-slate">
                              {lead.name || "—"}
                            </td>
                            <td className="py-3 text-slate">
                              {dateFmt.format(new Date(lead.createdAt))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredLeads.length === 0 && (
                      <EmptyState text={t("empty")} />
                    )}
                  </div>
                </Panel>

                <Panel className="lg:col-span-4" title={t("emails")}>
                  <ul className="space-y-3">
                    {data.identifiedEmails.map((item) => (
                      <li
                        key={`${item.email}-${item.ts}`}
                        className="rounded-xl border border-line/70 bg-mist/30 p-3"
                      >
                        <p className="text-sm font-semibold text-navy">
                          {item.email}
                        </p>
                        <p className="mt-1 text-xs text-slate">
                          {item.path || "—"} ·{" "}
                          {dateFmt.format(new Date(item.ts))}
                        </p>
                      </li>
                    ))}
                    {data.identifiedEmails.length === 0 && (
                      <EmptyState text={t("emptyEmails")} />
                    )}
                  </ul>
                </Panel>
              </div>
            )}

            {tab === "live" && (
              <Panel title={t("recent")} subtitle={t("recentHint")}>
                <ul className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
                  {data.recentEvents.map((event, index) => (
                    <li
                      key={`${event.ts}-${index}`}
                      className="grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-line hover:bg-mist/50"
                    >
                      <EventBadge type={event.type} label={t(`types.${event.type}` as "types.pageview")} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-navy">
                          {event.path}
                          {event.label ? ` · ${event.label}` : ""}
                          {typeof event.scrollDepth === "number"
                            ? ` · ${event.scrollDepth}%`
                            : ""}
                        </p>
                        <p className="truncate text-xs text-slate">
                          {event.visitorId}
                        </p>
                      </div>
                      <time className="whitespace-nowrap text-xs tabular-nums text-slate">
                        {dateFmt.format(new Date(event.ts))}
                      </time>
                    </li>
                  ))}
                  {data.recentEvents.length === 0 && (
                    <EmptyState text={t("empty")} />
                  )}
                </ul>
              </Panel>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-[0_12px_36px_rgba(7,26,61,0.08)] ${
        accent
          ? "border-teal/30 bg-[linear-gradient(160deg,#071a3d_0%,#123062_100%)] text-white"
          : "border-line bg-white"
      }`}
    >
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
          accent ? "text-teal" : "text-slate"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-bold tabular-nums tracking-tight ${
          accent ? "text-white" : "text-navy"
        }`}
      >
        {value}
      </p>
      <p className={`mt-2 text-xs ${accent ? "text-white/65" : "text-slate"}`}>
        {hint}
      </p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  className = "",
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_12px_40px_rgba(7,26,61,0.05)] ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-navy">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-xs leading-relaxed text-slate">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function BarList({
  items,
  empty,
}: {
  items: { label: string; value: number }[];
  empty: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  if (!items.length) return <EmptyState text={empty} />;

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium text-navy">{item.label}</span>
            <span className="tabular-nums text-slate">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-mist">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#00c2cc,#071a3d)] transition-[width] duration-500"
              style={{ width: `${Math.max(8, (item.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function ActivityChart({
  timeline,
  dayFmt,
  labels,
}: {
  timeline: InsightsPayload["timeline"];
  dayFmt: Intl.DateTimeFormat;
  labels: { pageviews: string; events: string; leads: string };
}) {
  const max = Math.max(...timeline.map((d) => d.events), 1);

  return (
    <div>
      <div className="flex h-44 items-end gap-1.5 sm:gap-2">
        {timeline.map((day) => {
          const height = Math.max(6, (day.events / max) * 100);
          const pv = Math.max(4, (day.pageviews / max) * 100);
          return (
            <div
              key={day.date}
              className="group relative flex h-full flex-1 flex-col justify-end"
              title={`${day.date}: ${day.events} evt / ${day.pageviews} pv / ${day.leads} leads`}
            >
              <div className="relative mx-auto flex w-full max-w-[28px] flex-1 items-end justify-center gap-0.5">
                <div
                  className="w-[45%] rounded-t-md bg-navy/20 transition-[height] duration-500 group-hover:bg-navy/35"
                  style={{ height: `${height}%` }}
                />
                <div
                  className="w-[45%] rounded-t-md bg-teal transition-[height] duration-500"
                  style={{ height: `${pv}%` }}
                />
              </div>
              <p className="mt-2 truncate text-center text-[10px] text-slate">
                {dayFmt.format(new Date(`${day.date}T12:00:00`))}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate">
        <LegendDot color="bg-teal" label={labels.pageviews} />
        <LegendDot color="bg-navy/25" label={labels.events} />
        <span>
          {labels.leads}:{" "}
          <strong className="text-navy">
            {timeline.reduce((sum, d) => sum + d.leads, 0)}
          </strong>
        </span>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
      {label}
    </span>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-teal-soft px-2.5 py-1 text-[11px] font-semibold text-navy">
      {children}
    </span>
  );
}

function EventBadge({ type, label }: { type: string; label: string }) {
  const tones: Record<string, string> = {
    pageview: "bg-navy text-white",
    click: "bg-teal text-navy-deep",
    scroll: "bg-mist text-navy",
    identify: "bg-amber-100 text-amber-900",
    heartbeat: "bg-line text-slate",
  };
  return (
    <span
      className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
        tones[type] || "bg-mist text-navy"
      }`}
    >
      {label}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-mist/40 px-4 py-8 text-center text-sm text-slate">
      {text}
    </div>
  );
}
