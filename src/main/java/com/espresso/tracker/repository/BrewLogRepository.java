package com.espresso.tracker.repository;

import com.espresso.tracker.entity.BrewLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for managing BrewLog entities in the database.
 */
@Repository
public interface BrewLogRepository extends JpaRepository<BrewLog, UUID> {

    /**
     * Finds all brew logs associated with a specific bean ID.
     *
     * @param beanId The UUID of the bean
     * @return List of brew logs for the given bean
     */
    List<BrewLog> findByBeanId(UUID beanId);

    /**
     * Custom JPQL query to fetch top-rated extractions (4-star and 5-star ratings).
     *
     * @param minRating The minimum rating to filter by (e.g., 4)
     * @return List of highly rated brew logs
     */
    @Query("SELECT b FROM BrewLog b WHERE b.rating >= :minRating ORDER BY b.rating DESC, b.createdAt DESC")
    List<BrewLog> findTopRatedExtractions(@Param("minRating") Integer minRating);
}
