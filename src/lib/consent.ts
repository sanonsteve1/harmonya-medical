export const CONSENT_STORAGE_KEY = "hm_consent_v1";
export const VISITOR_STORAGE_KEY = "hm_visitor_id";
export const SESSION_STORAGE_KEY = "hm_session_id";

export type ConsentState = {
  analytics: boolean;
  decidedAt: string;
};

export function parseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ConsentState;
    if (typeof parsed.analytics !== "boolean" || !parsed.decidedAt) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
