import { getAnalytics, logEvent } from "firebase/analytics";
import { app } from "@/lib/firebase";

// Initialize analytics
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Event types
export enum AnalyticsEventType {
  PAGE_VIEW = "page_view",
  LOGIN = "login",
  SIGN_UP = "sign_up",
  PROJECT_CREATE = "project_create",
  PROJECT_EDIT = "project_edit",
  SUBTITLE_CREATE = "subtitle_create",
  SUBTITLE_EDIT = "subtitle_edit",
  SUBSCRIPTION_VIEW = "subscription_view",
  SUBSCRIPTION_START = "subscription_start",
  SUBSCRIPTION_UPGRADE = "subscription_upgrade",
  EXPORT_SUBTITLES = "export_subtitles",
}

/**
 * Track an analytics event
 * @param eventType The type of event to track
 * @param eventParams Additional parameters for the event
 */
export function trackEvent(
  eventType: AnalyticsEventType,
  eventParams?: Record<string, any>,
) {
  if (!analytics) return;

  try {
    logEvent(analytics, eventType, eventParams);
  } catch (error) {
    console.error("Error tracking event:", error);
  }
}

/**
 * Track a page view
 * @param pageName The name of the page being viewed
 */
export function trackPageView(pageName: string) {
  trackEvent(AnalyticsEventType.PAGE_VIEW, { page_name: pageName });
}

/**
 * Track a user login
 * @param method The login method used (email, google, etc.)
 */
export function trackLogin(method: string) {
  trackEvent(AnalyticsEventType.LOGIN, { method });
}

/**
 * Track a user sign up
 * @param method The signup method used (email, google, etc.)
 */
export function trackSignUp(method: string) {
  trackEvent(AnalyticsEventType.SIGN_UP, { method });
}

/**
 * Track project creation
 * @param projectId The ID of the created project
 */
export function trackProjectCreate(projectId: number) {
  trackEvent(AnalyticsEventType.PROJECT_CREATE, { project_id: projectId });
}

/**
 * Track subscription start or upgrade
 * @param planId The ID of the subscription plan
 * @param planName The name of the subscription plan
 */
export function trackSubscriptionChange(planId: string, planName: string) {
  trackEvent(
    planId === "free"
      ? AnalyticsEventType.SUBSCRIPTION_START
      : AnalyticsEventType.SUBSCRIPTION_UPGRADE,
    {
      plan_id: planId,
      plan_name: planName,
    },
  );
}

export default {
  trackEvent,
  trackPageView,
  trackLogin,
  trackSignUp,
  trackProjectCreate,
  trackSubscriptionChange,
};
