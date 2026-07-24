import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Use the same API base URL as the rest of the app
// Local dev: empty string (uses Vite proxy to localhost:9090)
// GitHub Pages: Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

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

    const url = `${API_BASE_URL}/api/v1/analytics/visit`;

    // Use sendBeacon for fire-and-forget tracking
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    } else {
      // Fallback to fetch
      fetch(url, {
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