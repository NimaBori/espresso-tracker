package com.espresso.tracker.service;

import com.espresso.tracker.dto.AnalyticsDTO.*;
import com.espresso.tracker.entity.PageVisit;
import com.espresso.tracker.repository.BeanRepository;
import com.espresso.tracker.repository.BrewLogRepository;
import com.espresso.tracker.repository.PageVisitRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.ByteBuffer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for analytics tracking and dashboard data aggregation.
 */
@Service
public class AnalyticsService {

  private static final Logger log = LoggerFactory.getLogger(AnalyticsService.class);
  private static final String IP_API_URL = "http://ip-api.com/json/";
  private static final int GEO_CACHE_DAYS = 1;

  private final PageVisitRepository pageVisitRepository;
  private final BeanRepository beanRepository;
  private final BrewLogRepository brewLogRepository;
  private final HttpClient httpClient;

  public AnalyticsService(PageVisitRepository pageVisitRepository,
      BeanRepository beanRepository,
      BrewLogRepository brewLogRepository) {
    this.pageVisitRepository = pageVisitRepository;
    this.beanRepository = beanRepository;
    this.brewLogRepository = brewLogRepository;
    this.httpClient = HttpClient.newHttpClient();
  }

  /**
   * Record a page visit with optional geo-resolution.
   */
  @Transactional
  public void recordVisit(String pagePath, String resourceId, String ipAddress, String userAgent) {
    PageVisit visit = new PageVisit();
    visit.setPagePath(pagePath);
    if (resourceId != null && !resourceId.isBlank()) {
      try {
        visit.setResourceId(UUID.fromString(resourceId));
      } catch (IllegalArgumentException e) {
        log.warn("Invalid resourceId UUID: {}", resourceId);
      }
    }
    visit.setIpAddress(ipAddress);
    visit.setUserAgent(userAgent);
    visit.setVisitedAt(LocalDateTime.now());

    // Resolve geo-location for unique IPs (once per day)
    if (ipAddress != null && !ipAddress.isBlank() && !ipAddress.equals("127.0.0.1")
        && !ipAddress.equals("0:0:0:0:0:0:0:1")) {
      LocalDateTime since = LocalDateTime.now().minusDays(GEO_CACHE_DAYS);
      boolean alreadyResolved = pageVisitRepository.existsByIpAddressAndVisitedAtAfter(ipAddress, since);
      if (!alreadyResolved) {
        resolveGeoLocation(visit);
      } else {
        // Copy geo from a previous visit by this IP
        pageVisitRepository.findByIpAddressAndVisitedAtAfter(ipAddress, since)
            .stream()
            .findFirst()
            .ifPresent(prev -> {
              visit.setCountry(prev.getCountry());
              visit.setCity(prev.getCity());
            });
      }
    }

    pageVisitRepository.save(visit);
  }

  /**
   * Get aggregated dashboard statistics.
   */
  public DashboardStats getDashboardStats() {
    LocalDateTime now = LocalDateTime.now();
    LocalDateTime todayStart = now.toLocalDate().atStartOfDay();

    long totalVisits = pageVisitRepository.count();
    long visitsToday = pageVisitRepository.countByVisitedAtBetween(todayStart, now);
    long totalBeans = beanRepository.count();
    long totalBrewLogs = brewLogRepository.count();

    List<VisitTrendPoint> visitTrend = getVisitTrend(30);
    List<GeoDistribution> geoDistribution = getGeoDistribution();
    List<PopularBean> topBeans = getTopBeans(10);
    List<PopularBrew> topBrews = getTopBrews(10);
    List<BeanPerformance> beanPerformance = getBeanPerformance();
    List<RatingDistribution> ratingDistribution = getRatingDistribution();
    List<ExtractionRatioPoint> extractionRatios = getExtractionRatios();

    return DashboardStats.builder()
        .totalVisits(totalVisits)
        .visitsToday(visitsToday)
        .totalBeans(totalBeans)
        .totalBrewLogs(totalBrewLogs)
        .visitTrend(visitTrend)
        .geoDistribution(geoDistribution)
        .topBeans(topBeans)
        .topBrews(topBrews)
        .beanPerformance(beanPerformance)
        .ratingDistribution(ratingDistribution)
        .extractionRatios(extractionRatios)
        .build();
  }

  /**
   * Get top N most viewed beans.
   */
  public List<PopularBean> getTopBeans(int limit) {
    LocalDateTime since = LocalDateTime.now().minusDays(30);
    List<Object[]> results = pageVisitRepository.findTopBeansByVisits(since, PageRequest.of(0, limit));
    List<PopularBean> beans = new ArrayList<>();
    for (Object[] row : results) {
      UUID beanId = toUUID(row[0]);
      long visitCount = (Long) row[1];
      String beanName = beanRepository.findById(beanId)
          .map(b -> b.getBeanName())
          .orElse("Unknown");
      beans.add(PopularBean.builder()
          .beanId(beanId.toString())
          .beanName(beanName)
          .visitCount(visitCount)
          .build());
    }
    return beans;
  }

  /**
   * Get top N most viewed brew logs.
   */
  public List<PopularBrew> getTopBrews(int limit) {
    LocalDateTime since = LocalDateTime.now().minusDays(30);
    List<Object[]> results = pageVisitRepository.findTopBrewsByVisits(since, PageRequest.of(0, limit));
    return results.stream()
        .map(row -> PopularBrew.builder()
            .brewId(toUUID(row[0]).toString())
            .visitCount((Long) row[1])
            .build())
        .collect(Collectors.toList());
  }

  /**
   * Get geographic distribution of visits.
   */
  public List<GeoDistribution> getGeoDistribution() {
    List<Object[]> results = pageVisitRepository.countByCountryGrouped();
    return results.stream()
        .map(row -> GeoDistribution.builder()
            .country((String) row[0])
            .count((Long) row[1])
            .build())
        .collect(Collectors.toList());
  }

  /**
   * Get daily visit trend for the last N days.
   */
  public List<VisitTrendPoint> getVisitTrend(int days) {
    LocalDateTime since = LocalDateTime.now().minusDays(days);
    List<Object[]> results = pageVisitRepository.countByVisitedAtGroupedByDate(since);

    // Fill in missing dates with zero counts
    Map<LocalDate, Long> dateCountMap = new HashMap<>();
    for (Object[] row : results) {
      java.sql.Date sqlDate = (java.sql.Date) row[0];
      LocalDate date = sqlDate.toLocalDate();
      dateCountMap.put(date, ((Number) row[1]).longValue());
    }

    List<VisitTrendPoint> trend = new ArrayList<>();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    for (int i = days - 1; i >= 0; i--) {
      LocalDate date = LocalDate.now().minusDays(i);
      long count = dateCountMap.getOrDefault(date, 0L);
      trend.add(VisitTrendPoint.builder()
          .date(date.format(formatter))
          .count(count)
          .build());
    }
    return trend;
  }

  /**
   * Get bean performance summary (avg rating vs brew count).
   */
  public List<BeanPerformance> getBeanPerformance() {
    List<Object[]> results = brewLogRepository.getBeanPerformanceSummary(PageRequest.of(0, 50));
    return results.stream()
        .map(row -> BeanPerformance.builder()
            .beanId(toUUID(row[0]).toString())
            .beanName((String) row[1])
            .avgRating(((Number) row[2]).doubleValue())
            .brewCount(((Number) row[3]).longValue())
            .build())
        .collect(Collectors.toList());
  }

  /**
   * Get rating distribution (count of 1-5 star ratings).
   */
  public List<RatingDistribution> getRatingDistribution() {
    List<Object[]> results = brewLogRepository.getRatingDistribution();
    Map<Integer, Long> ratingMap = new HashMap<>();
    for (int i = 1; i <= 5; i++) {
      ratingMap.put(i, 0L);
    }
    for (Object[] row : results) {
      Integer rating = (Integer) row[0];
      Long count = ((Number) row[1]).longValue();
      ratingMap.put(rating, count);
    }
    return ratingMap.entrySet().stream()
        .map(entry -> RatingDistribution.builder()
            .rating(entry.getKey())
            .count(entry.getValue())
            .build())
        .sorted(Comparator.comparingInt(RatingDistribution::getRating))
        .collect(Collectors.toList());
  }

  /**
   * Get extraction ratio data points (dose vs yield colored by rating).
   */
  public List<ExtractionRatioPoint> getExtractionRatios() {
    List<Object[]> results = brewLogRepository.getExtractionData();
    return results.stream()
        .map(row -> ExtractionRatioPoint.builder()
            .beanName((String) row[0])
            .doseGrams(((Number) row[1]).doubleValue())
            .yieldGrams(((Number) row[2]).doubleValue())
            .ratio(((Number) row[3]).doubleValue())
            .rating((Integer) row[4])
            .build())
        .collect(Collectors.toList());
  }

  /**
   * Convert a BINARY(16) byte array or UUID to UUID.
   * Native queries return BINARY(16) as byte[], JPQL returns UUID.
   */
  private UUID toUUID(Object value) {
    if (value instanceof UUID) {
      return (UUID) value;
    }
    if (value instanceof byte[]) {
      byte[] bytes = (byte[]) value;
      ByteBuffer bb = ByteBuffer.wrap(bytes);
      long high = bb.getLong();
      long low = bb.getLong();
      return new UUID(high, low);
    }
    if (value instanceof String) {
      return UUID.fromString((String) value);
    }
    throw new IllegalArgumentException("Cannot convert " + value.getClass() + " to UUID");
  }

  /**
   * Resolve country/city from IP address using ip-api.com.
   */
  private void resolveGeoLocation(PageVisit visit) {
    try {
      String ip = visit.getIpAddress();
      HttpRequest request = HttpRequest.newBuilder()
          .uri(URI.create(IP_API_URL + ip + "?fields=country,city"))
          .timeout(java.time.Duration.ofSeconds(3))
          .GET()
          .build();

      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
      if (response.statusCode() == 200) {
        String body = response.body();
        // Simple JSON parsing without external dependency
        if (body.contains("\"country\"")) {
          String country = extractJsonString(body, "country");
          String city = extractJsonString(body, "city");
          visit.setCountry(country);
          visit.setCity(city);
        }
      }
    } catch (Exception e) {
      log.warn("Failed to resolve geo-location for IP: {}", visit.getIpAddress(), e);
    }
  }

  /**
   * Simple JSON string value extractor (no external dependency needed).
   */
  private String extractJsonString(String json, String key) {
    String searchKey = "\"" + key + "\":\"";
    int start = json.indexOf(searchKey);
    if (start == -1) {
      // Try with quotes around value
      String searchKey2 = "\"" + key + "\": \"";
      start = json.indexOf(searchKey2);
      if (start == -1)
        return null;
      start += searchKey2.length();
    } else {
      start += searchKey.length();
    }
    int end = json.indexOf("\"", start);
    if (end == -1)
      return null;
    String value = json.substring(start, end);
    return value.isEmpty() || value.equals("-") ? null : value;
  }
}