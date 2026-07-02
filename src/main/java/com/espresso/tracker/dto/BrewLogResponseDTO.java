package com.espresso.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Transfer Object for returning Brew Log information to the client.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
