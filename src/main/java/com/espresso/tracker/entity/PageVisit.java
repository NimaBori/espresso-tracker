package com.espresso.tracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing a page visit for analytics tracking.
 */
@Entity
@Table(name = "page_visits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageVisit {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "page_path", nullable = false)
  private String pagePath;

  @Column(name = "resource_id")
  private UUID resourceId;

  @Column(name = "ip_address", length = 45)
  private String ipAddress;

  @Column(name = "country", length = 100)
  private String country;

  @Column(name = "city", length = 100)
  private String city;

  @Column(name = "user_agent", columnDefinition = "TEXT")
  private String userAgent;

  @Column(name = "visited_at", nullable = false)
  private LocalDateTime visitedAt;

  @PrePersist
  protected void onCreate() {
    if (visitedAt == null) {
      visitedAt = LocalDateTime.now();
    }
  }
}