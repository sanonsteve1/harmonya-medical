export type TrackEventType =
  | "pageview"
  | "click"
  | "scroll"
  | "identify"
  | "heartbeat";

export type TrackEvent = {
  visitorId: string;
  sessionId: string;
  type: TrackEventType;
  path: string;
  locale?: string;
  label?: string;
  href?: string;
  scrollDepth?: number;
  referrer?: string;
  email?: string;
  userAgent?: string;
  ts: string;
};

export type LeadRecord = {
  id: string;
  source: "contact" | "newsletter";
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
  visitorId?: string;
  sessionId?: string;
  locale?: string;
  consentMarketing: boolean;
  createdAt: string;
};
