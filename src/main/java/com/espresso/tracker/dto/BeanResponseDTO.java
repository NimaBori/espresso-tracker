package com.espresso.tracker.dto;

import com.espresso.tracker.entity.RoastLevel;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Transfer Object for returning Bean information to the client.
 */
public class BeanResponseDTO {

    private UUID id;
    private String roasterName;
    private String beanName;
    private String origin;
    private RoastLevel roastLevel;
    private String tastingNotes;
    private Boolean isActive;
    private LocalDateTime createdAt;

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
