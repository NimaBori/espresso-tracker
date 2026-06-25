package com.espresso.tracker.dto;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Transfer Object for returning Brew Log information to the client.
 */
public class BrewLogResponseDTO {

    private UUID id;
    private UUID beanId;
    private String beanName; // Useful for UI display without fetching full bean
    private Double doseGrams;
    private Double yieldGrams;
    private Integer extractionTimeSeconds;
    private String grindSetting;
    private Integer rating;
    private String notes;
    private LocalDateTime createdAt;

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getBeanId() {
        return beanId;
    }

    public void setBeanId(UUID beanId) {
        this.beanId = beanId;
    }

    public String getBeanName() {
        return beanName;
    }

    public void setBeanName(String beanName) {
        this.beanName = beanName;
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
