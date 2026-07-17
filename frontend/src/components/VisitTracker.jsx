import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Invisible component that tracks page visits.
 * Place in App.jsx wrapper. On every route change,
 * sends a fire-and-forget POST to /api/v1/analytics/visit.
 */
export default function VisitTracker() {
  const location = useLocation();

  useEffect(() => {
    const pagePath = location.pathname;
    let resourceId = null;

    // Extract resource ID from URL patterns like /beans/{id} or /brew-log/{id}
    const beanMatch = pagePath.match(/^\/beans\/([a-f0-9-]+)/);
    const brewMatch = pagePath.match(/^\/brew-log\/([a-f0-9-]+)/);

    if (beanMatch) {
      resourceId = beanMatch[1];
    } else if (brewMatch) {
      resourceId = brewMatch[1];
    }

    const payload = JSON.stringify({
      pagePath,
      resourceId,
    });

    // Use sendBeacon for fire-and-forget tracking
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/v1/analytics/visit", blob);
    } else {
      // Fallback to fetch
      fetch("/api/v1/analytics/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Silently fail — tracking should never disrupt the user
      });
    }
  }, [location.pathname]);

  // This component renders nothing
  return null;
}