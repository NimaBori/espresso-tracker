package com.espresso.tracker.repository;

import com.espresso.tracker.entity.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for managing Bean entities in the database.
 */
@Repository
public interface BeanRepository extends JpaRepository<Bean, UUID> {

    /**
     * Finds all beans that are active (not soft-deleted), with pagination.
     *
     * @param pageable Pagination information
     * @return A page of active beans
     */
    Page<Bean> findByIsActiveTrue(Pageable pageable);
}
