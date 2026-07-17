package com.espresso.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTOs for analytics dashboard data.
 */
public class AnalyticsDTO {

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class DashboardStats {
    private long totalVisits;
    private long visitsToday;
    private long totalBeans;
    private long totalBrewLogs;
    private List<VisitTrendPoint> visitTrend;
    private List<GeoDistribution> geoDistribution;
    private List<PopularBean> topBeans;
    private List<PopularBrew> topBrews;
    private List<BeanPerformance> beanPerformance;
    private List<RatingDistribution> ratingDistribution;
    private List<ExtractionRatioPoint> extractionRatios;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class VisitTrendPoint {
    private String date;
    private long count;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class GeoDistribution {
    private String country;
    private long count;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class PopularBean {
    private String beanId;
    private String beanName;
    private long visitCount;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class PopularBrew {
    private String brewId;
    private long visitCount;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class BeanPerformance {
    private String beanId;
    private String beanName;
    private double avgRating;
    private long brewCount;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class RatingDistribution {
    private int rating;
    private long count;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ExtractionRatioPoint {
    private String beanName;
    private double doseGrams;
    private double yieldGrams;
    private double ratio;
    private int rating;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class VisitRequest {
    private String pagePath;
    private String resourceId;
  }
}