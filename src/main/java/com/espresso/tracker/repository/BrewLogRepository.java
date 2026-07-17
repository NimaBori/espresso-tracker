package com.espresso.tracker.repository;

import com.espresso.tracker.entity.BrewLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Repository for managing BrewLog entities in the database.
 */
@Repository
public interface BrewLogRepository extends JpaRepository<BrewLog, UUID> {

        /**
         * Finds all brew logs associated with a specific bean ID.
         */
        List<BrewLog> findByBeanId(UUID beanId);

        /**
         * Custom JPQL query to fetch top-rated extractions (4-star and 5-star ratings).
         */
        @Query("SELECT b FROM BrewLog b WHERE b.rating >= :minRating ORDER BY b.rating DESC, b.createdAt DESC")
        List<BrewLog> findTopRatedExtractions(@Param("minRating") Integer minRating);

        /**
         * Get average rating for a specific bean.
         */
        @Query("SELECT AVG(b.rating) FROM BrewLog b WHERE b.bean.id = :beanId")
        Double getAverageRatingByBeanId(@Param("beanId") UUID beanId);

        /**
         * Get bean performance summary — avg rating and brew count per bean.
         * Uses native query to avoid JPQL GROUP BY limitations with joined entities.
         */
        @Query(value = "SELECT b.bean_id as beanId, be.bean_name as beanName, COALESCE(AVG(b.rating), 0) as avgRating, COUNT(*) as brewCount FROM brew_logs b JOIN beans be ON b.bean_id = be.id WHERE b.rating IS NOT NULL GROUP BY b.bean_id, be.bean_name ORDER BY avgRating DESC", nativeQuery = true)
        List<Object[]> getBeanPerformanceSummary(org.springframework.data.domain.Pageable pageable);

        /**
         * Get brew trend — daily brew count and avg rating.
         */
        @Query(value = "SELECT DATE(b.created_at) as date, COUNT(*) as count, COALESCE(AVG(b.rating), 0) as avgRating FROM brew_logs b WHERE b.created_at >= :since GROUP BY DATE(b.created_at) ORDER BY date", nativeQuery = true)
        List<Object[]> getBrewTrend(@Param("since") LocalDateTime since);

        /**
         * Get rating distribution (count of each rating value 1-5).
         */
        @Query("SELECT b.rating, COUNT(b) FROM BrewLog b WHERE b.rating IS NOT NULL GROUP BY b.rating ORDER BY b.rating")
        List<Object[]> getRatingDistribution();

        /**
         * Get extraction data for scatter plot (dose, yield, ratio, rating).
         * Uses native query to avoid potential JPQL issues with computed columns.
         */
        @Query(value = "SELECT be.bean_name, b.dose_grams, b.yield_grams, (b.yield_grams / b.dose_grams) as ratio, b.rating FROM brew_logs b JOIN beans be ON b.bean_id = be.id WHERE b.dose_grams > 0 AND b.rating IS NOT NULL ORDER BY b.created_at DESC", nativeQuery = true)
        List<Object[]> getExtractionData();
}