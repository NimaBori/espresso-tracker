package com.espresso.tracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing an individual espresso extraction (brew).
 */
@Entity
@Table(name = "brew_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrewLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bean_id", nullable = false)
    private Bean bean;

    @Column(name = "dose_grams", nullable = false)
    private Double doseGrams;

    @Column(name = "yield_grams", nullable = false)
    private Double yieldGrams;

    @Column(name = "extraction_time_seconds", nullable = false)
    private Integer extractionTimeSeconds;

    @Column(name = "grind_setting")
    private String grindSetting;

    @Column(name = "rating")
    private Integer rating; // 1-5

    @Column(name = "notes")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
