package com.espresso.tracker.repository;

import com.espresso.tracker.entity.PageVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Repository for managing PageVisit entities for analytics.
 */
@Repository
public interface PageVisitRepository extends JpaRepository<PageVisit, UUID> {

        /**
         * Count total visits between two dates.
         */
        long countByVisitedAtBetween(LocalDateTime start, LocalDateTime end);

        /**
         * Find top beans by page visit count (pages matching /beans/{id}).
         */
        @Query("SELECT pv.resourceId as beanId, COUNT(pv) as visitCount " +
                        "FROM PageVisit pv " +
                        "WHERE pv.pagePath LIKE '/beans/%' AND pv.resourceId IS NOT NULL " +
                        "AND pv.visitedAt >= :since " +
                        "GROUP BY pv.resourceId " +
                        "ORDER BY visitCount DESC")
        List<Object[]> findTopBeansByVisits(@Param("since") LocalDateTime since,
                        org.springframework.data.domain.Pageable pageable);

        /**
         * Find top brew logs by page visit count (pages matching /brew-log/{id}).
         */
        @Query("SELECT pv.resourceId as brewId, COUNT(pv) as visitCount " +
                        "FROM PageVisit pv " +
                        "WHERE pv.pagePath LIKE '/brew-log/%' AND pv.resourceId IS NOT NULL " +
                        "AND pv.visitedAt >= :since " +
                        "GROUP BY pv.resourceId " +
                        "ORDER BY visitCount DESC")
        List<Object[]> findTopBrewsByVisits(@Param("since") LocalDateTime since,
                        org.springframework.data.domain.Pageable pageable);

        /**
         * Count visits grouped by country.
         */
        @Query("SELECT pv.country, COUNT(pv) as count " +
                        "FROM PageVisit pv " +
                        "WHERE pv.country IS NOT NULL " +
                        "GROUP BY pv.country " +
                        "ORDER BY count DESC")
        List<Object[]> countByCountryGrouped();

        /**
         * Count visits grouped by date for trend analysis.
         */
        @Query(value = "SELECT DATE(pv.visited_at) as date, COUNT(*) as count FROM page_visits pv WHERE pv.visited_at >= :since GROUP BY DATE(pv.visited_at) ORDER BY date ASC", nativeQuery = true)
        List<Object[]> countByVisitedAtGroupedByDate(@Param("since") LocalDateTime since);

        /**
         * Check if an IP was already seen today (for rate-limiting geo lookups).
         */
        boolean existsByIpAddressAndVisitedAtAfter(String ipAddress, LocalDateTime since);

        /**
         * Find visits by IP address after a given time (for geo-copying).
         */
        List<PageVisit> findByIpAddressAndVisitedAtAfter(String ipAddress, LocalDateTime since);
}