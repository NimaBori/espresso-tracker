package com.espresso.tracker.dto;

import com.espresso.tracker.entity.RoastLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Transfer Object for returning Bean information to the client.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BeanResponseDTO {

    private UUID id;
    private String roasterName;
    private String beanName;
    private String origin;
    private RoastLevel roastLevel;
    private String tastingNotes;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
