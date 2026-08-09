import {
  SESSION_STORAGE_KEY,
  VISITOR_STORAGE_KEY,
} from "@/lib/consent";
import { createId } from "@/lib/id";

export function getOrCreateVisitorId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_STORAGE_KEY);
  if (!id) {
    id = createId("vis");
    localStorage.setItem(VISITOR_STORAGE_KEY, id);
  }
  return id;
}

export function getOrCreateSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = createId("ses");
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
}

export function getTrackingIds() {
  return {
    visitorId: getOrCreateVisitorId(),
    sessionId: getOrCreateSessionId(),
  };
}
