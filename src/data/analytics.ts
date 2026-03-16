export const POSTHOG_EVENTS = {
  PROJECT_LINK_CLICK: "project_link_click",
  CONTACT_CLICK: "contact_click",
  ARCHIVE_EXPAND: "archive_expand",
  NAV_CLICK: "nav_click",
  BOOK_CLICK: "book_click",
  EXTERNAL_LINK_CLICK: "external_link_click",
} as const;

type PostHogEventName = (typeof POSTHOG_EVENTS)[keyof typeof POSTHOG_EVENTS];
type PostHogEventProperties = Record<string, string | number | boolean>;

type PostHogCapture = (
  eventName: string,
  properties?: PostHogEventProperties,
) => void;

declare global {
  interface Window {
    posthog?: {
      capture?: PostHogCapture;
    };
  }
}

export function capturePostHogEvent(
  eventName: PostHogEventName,
  properties?: PostHogEventProperties,
) {
  if (typeof window === "undefined") return;
  const capture = window.posthog?.capture;
  if (typeof capture !== "function") return;
  capture(eventName, properties);
}
