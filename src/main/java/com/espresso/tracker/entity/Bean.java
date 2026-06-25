package com.espresso.tracker.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entity representing a bag of coffee beans in the inventory.
 */
@Entity
@Table(name = "beans")
public class Bean {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "roaster_name", nullable = false)
    private String roasterName;

    @Column(name = "bean_name", nullable = false)
    private String beanName;

    @Column(name = "origin")
    private String origin;

    @Enumerated(EnumType.STRING)
    @Column(name = "roast_level")
    private RoastLevel roastLevel;

    @Column(name = "tasting_notes")
    private String tastingNotes;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "bean", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BrewLog> brewLogs = new ArrayList<>();

    // Default Constructor for JPA
    public Bean() {
    }

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

    public List<BrewLog> getBrewLogs() {
        return brewLogs;
    }

    public void setBrewLogs(List<BrewLog> brewLogs) {
        this.brewLogs = brewLogs;
    }

    // Utility methods for bi-directional mapping
    public void addBrewLog(BrewLog log) {
        brewLogs.add(log);
        log.setBean(this);
    }

    public void removeBrewLog(BrewLog log) {
        brewLogs.remove(log);
        log.setBean(null);
    }
}
