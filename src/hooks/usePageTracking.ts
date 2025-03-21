import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/services/analyticsService";

/**
 * Hook to track page views when the route changes
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Get the page name from the pathname
    const pageName = location.pathname.split("/").pop() || "home";

    // Track the page view
    trackPageView(pageName);
  }, [location]);

  return null;
}
