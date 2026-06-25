package com.espresso.tracker.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing an individual espresso extraction (brew).
 */
@Entity
@Table(name = "brew_logs")
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

    // Default Constructor for JPA
    public BrewLog() {
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Bean getBean() {
        return bean;
    }

    public void setBean(Bean bean) {
        this.bean = bean;
    }

    public Double getDoseGrams() {
        return doseGrams;
    }

    public void setDoseGrams(Double doseGrams) {
        this.doseGrams = doseGrams;
    }

    public Double getYieldGrams() {
        return yieldGrams;
    }

    public void setYieldGrams(Double yieldGrams) {
        this.yieldGrams = yieldGrams;
    }

    public Integer getExtractionTimeSeconds() {
        return extractionTimeSeconds;
    }

    public void setExtractionTimeSeconds(Integer extractionTimeSeconds) {
        this.extractionTimeSeconds = extractionTimeSeconds;
    }

    public String getGrindSetting() {
        return grindSetting;
    }

    public void setGrindSetting(String grindSetting) {
        this.grindSetting = grindSetting;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
