package com.espresso.tracker.dto;

import com.espresso.tracker.entity.RoastLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object for creating or updating a Bean.
 */
public class BeanRequestDTO {

    @NotBlank(message = "Roaster name is required")
    private String roasterName;

    @NotBlank(message = "Bean name is required")
    private String beanName;

    private String origin;

    @NotNull(message = "Roast level is required")
    private RoastLevel roastLevel;

    private String tastingNotes;

    // Getters and Setters

    public String getRoasterName() {
        return roasterName;
    }

    public void setRoasterName(String roasterName) {
        this.roasterName = roasterName;
    }

    public String getBeanName() {
        return beanName;
    }

    public void setBeanName(String beanName) {
        this.beanName = beanName;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public RoastLevel getRoastLevel() {
        return roastLevel;
    }

    public void setRoastLevel(RoastLevel roastLevel) {
        this.roastLevel = roastLevel;
    }

    public String getTastingNotes() {
        return tastingNotes;
    }

    public void setTastingNotes(String tastingNotes) {
        this.tastingNotes = tastingNotes;
    }
}
