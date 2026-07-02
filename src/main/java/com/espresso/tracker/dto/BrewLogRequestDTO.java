package com.espresso.tracker.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Data Transfer Object for creating a new Brew Log.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrewLogRequestDTO {

    @NotNull(message = "Bean ID is required to log a brew")
    private UUID beanId;

    @NotNull(message = "Dose is required")
    @Positive(message = "Dose must be greater than zero")
    private Double doseGrams;

    @NotNull(message = "Yield is required")
    @Positive(message = "Yield must be greater than zero")
    private Double yieldGrams;

    @NotNull(message = "Extraction time is required")
    @Positive(message = "Extraction time must be greater than zero")
    private Integer extractionTimeSeconds;

    private String grindSetting;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot be more than 5")
    private Integer rating;

    private String notes;
}
