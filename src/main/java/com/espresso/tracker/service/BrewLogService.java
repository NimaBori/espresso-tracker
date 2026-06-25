package com.espresso.tracker.service;

import com.espresso.tracker.dto.BrewLogRequestDTO;
import com.espresso.tracker.dto.BrewLogResponseDTO;
import com.espresso.tracker.entity.Bean;
import com.espresso.tracker.entity.BrewLog;
import com.espresso.tracker.exception.ResourceNotFoundException;
import com.espresso.tracker.repository.BeanRepository;
import com.espresso.tracker.repository.BrewLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing brew logs (espresso extractions).
 */
@Service
public class BrewLogService {

    private final BrewLogRepository brewLogRepository;
    private final BeanRepository beanRepository;

    public BrewLogService(BrewLogRepository brewLogRepository, BeanRepository beanRepository) {
        this.brewLogRepository = brewLogRepository;
        this.beanRepository = beanRepository;
    }

    /**
     * Log a new espresso extraction.
     */
    @Transactional
    public BrewLogResponseDTO createBrewLog(BrewLogRequestDTO requestDTO) {
        Bean bean = beanRepository.findById(requestDTO.getBeanId())
                .orElseThrow(() -> new ResourceNotFoundException("Bean not found with id: " + requestDTO.getBeanId()));
        
        BrewLog brewLog = new BrewLog();
        mapToEntity(requestDTO, brewLog);
        brewLog.setBean(bean);
        
        BrewLog savedLog = brewLogRepository.save(brewLog);
        return mapToResponseDTO(savedLog);
    }

    /**
     * Get all brew logs for a specific bean.
     */
    @Transactional(readOnly = true)
    public List<BrewLogResponseDTO> getLogsByBeanId(UUID beanId) {
        // Validate bean exists
        if (!beanRepository.existsById(beanId)) {
            throw new ResourceNotFoundException("Bean not found with id: " + beanId);
        }
        
        return brewLogRepository.findByBeanId(beanId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Fetch top-rated extractions (4 or 5 stars).
     */
    @Transactional(readOnly = true)
    public List<BrewLogResponseDTO> getTopRatedExtractions() {
        return brewLogRepository.findTopRatedExtractions(4).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // --- Mappers ---

    private void mapToEntity(BrewLogRequestDTO dto, BrewLog entity) {
        entity.setDoseGrams(dto.getDoseGrams());
        entity.setYieldGrams(dto.getYieldGrams());
        entity.setExtractionTimeSeconds(dto.getExtractionTimeSeconds());
        entity.setGrindSetting(dto.getGrindSetting());
        entity.setRating(dto.getRating());
        entity.setNotes(dto.getNotes());
    }

    private BrewLogResponseDTO mapToResponseDTO(BrewLog entity) {
        BrewLogResponseDTO dto = new BrewLogResponseDTO();
        dto.setId(entity.getId());
        if (entity.getBean() != null) {
            dto.setBeanId(entity.getBean().getId());
            dto.setBeanName(entity.getBean().getBeanName());
        }
        dto.setDoseGrams(entity.getDoseGrams());
        dto.setYieldGrams(entity.getYieldGrams());
        dto.setExtractionTimeSeconds(entity.getExtractionTimeSeconds());
        dto.setGrindSetting(entity.getGrindSetting());
        dto.setRating(entity.getRating());
        dto.setNotes(entity.getNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
