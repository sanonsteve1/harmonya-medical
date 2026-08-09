"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import {
  CONSENT_STORAGE_KEY,
  parseConsent,
  type ConsentState,
} from "@/lib/consent";
import { getTrackingIds } from "@/components/analytics/visitor";

function sendEvent(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
    return;
  }
  void fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

function readConsent(): ConsentState | null {
  return parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
}

export function AnalyticsProvider() {
  const pathname = usePathname();
  const locale = useLocale();
  const maxScroll = useRef(0);
  const enabledRef = useRef(false);

  const trackPageview = () => {
    if (!readConsent()?.analytics) return;
    const { visitorId, sessionId } = getTrackingIds();
    maxScroll.current = 0;
    sendEvent({
      visitorId,
      sessionId,
      type: "pageview",
      path: pathname,
      locale,
      referrer: document.referrer || undefined,
    });
  };

  useEffect(() => {
    enabledRef.current = Boolean(readConsent()?.analytics);

    const onConsentUpdated = () => {
      const enabled = Boolean(readConsent()?.analytics);
      const justAccepted = enabled && !enabledRef.current;
      enabledRef.current = enabled;
      if (justAccepted) trackPageview();
    };

    window.addEventListener("hm:consent-updated", onConsentUpdated);
    return () => window.removeEventListener("hm:consent-updated", onConsentUpdated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locale]);

  // Pageviews on navigation (only if already consented)
  useEffect(() => {
    trackPageview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locale]);

  // Clicks + scroll depth
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!enabledRef.current) return;
      const target = (event.target as HTMLElement | null)?.closest(
        "a, button, [data-track]",
      ) as HTMLElement | null;
      if (!target) return;

      const { visitorId, sessionId } = getTrackingIds();
      const label =
        target.getAttribute("data-track") ||
        target.getAttribute("aria-label") ||
        target.textContent?.trim().slice(0, 120) ||
        target.tagName;

      sendEvent({
        visitorId,
        sessionId,
        type: "click",
        path: pathname,
        locale,
        label,
        href: target instanceof HTMLAnchorElement ? target.href : undefined,
      });
    };

    const onScroll = () => {
      if (!enabledRef.current) return;
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) return;
      const depth = Math.round((window.scrollY / total) * 100);
      const milestones = [25, 50, 75, 100];
      for (const mark of milestones) {
        if (depth >= mark && maxScroll.current < mark) {
          maxScroll.current = mark;
          const { visitorId, sessionId } = getTrackingIds();
          sendEvent({
            visitorId,
            sessionId,
            type: "scroll",
            path: pathname,
            locale,
            scrollDepth: mark,
          });
        }
      }
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, locale]);

  return null;
}
