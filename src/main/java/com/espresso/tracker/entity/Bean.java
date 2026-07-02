package com.espresso.tracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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
@Data
@NoArgsConstructor
@AllArgsConstructor
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
