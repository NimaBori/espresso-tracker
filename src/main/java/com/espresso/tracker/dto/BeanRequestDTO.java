package com.espresso.tracker.dto;

import com.espresso.tracker.entity.RoastLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for creating or updating a Bean.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BeanRequestDTO {

    @NotBlank(message = "Roaster name is required")
    private String roasterName;

    @NotBlank(message = "Bean name is required")
    private String beanName;

    private String origin;

    @NotNull(message = "Roast level is required")
    private RoastLevel roastLevel;

    private String tastingNotes;
}
