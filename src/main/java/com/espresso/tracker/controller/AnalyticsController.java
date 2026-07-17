package com.espresso.tracker.controller;

import com.espresso.tracker.dto.AnalyticsDTO.*;
import com.espresso.tracker.service.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for analytics tracking and dashboard data.
 */
@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

  private final AnalyticsService analyticsService;

  public AnalyticsController(AnalyticsService analyticsService) {
    this.analyticsService = analyticsService;
  }

  /**
   * Public endpoint to record a page visit (no auth required).
   */
  @PostMapping("/visit")
  public ResponseEntity<Void> recordVisit(@RequestBody VisitRequest request,
      HttpServletRequest httpRequest) {
    String ipAddress = getClientIp(httpRequest);
    String userAgent = httpRequest.getHeader("User-Agent");
    analyticsService.recordVisit(request.getPagePath(), request.getResourceId(), ipAddress, userAgent);
    return ResponseEntity.ok().build();
  }

  /**
   * ADMIN only: Get full dashboard statistics.
   */
  @GetMapping("/dashboard")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<DashboardStats> getDashboardStats() {
    return ResponseEntity.ok(analyticsService.getDashboardStats());
  }

  /**
   * ADMIN only: Get top viewed beans.
   */
  @GetMapping("/top-beans")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<PopularBean>> getTopBeans(
      @RequestParam(defaultValue = "10") int limit) {
    return ResponseEntity.ok(analyticsService.getTopBeans(limit));
  }

  /**
   * ADMIN only: Get top viewed brew logs.
   */
  @GetMapping("/top-brews")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<PopularBrew>> getTopBrews(
      @RequestParam(defaultValue = "10") int limit) {
    return ResponseEntity.ok(analyticsService.getTopBrews(limit));
  }

  /**
   * ADMIN only: Get geographic distribution of visits.
   */
  @GetMapping("/geo")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<GeoDistribution>> getGeoDistribution() {
    return ResponseEntity.ok(analyticsService.getGeoDistribution());
  }

  /**
   * ADMIN only: Get visit trend data.
   */
  @GetMapping("/trends")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<VisitTrendPoint>> getVisitTrend(
      @RequestParam(defaultValue = "30") int days) {
    return ResponseEntity.ok(analyticsService.getVisitTrend(days));
  }

  /**
   * Extract client IP address from request, respecting proxy headers.
   */
  private String getClientIp(HttpServletRequest request) {
    String ip = request.getHeader("X-Forwarded-For");
    if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
      ip = request.getHeader("X-Real-IP");
    }
    if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
      ip = request.getRemoteAddr();
    }
    // Take the first IP if there's a chain
    if (ip != null && ip.contains(",")) {
      ip = ip.split(",")[0].trim();
    }
    return ip;
  }
}