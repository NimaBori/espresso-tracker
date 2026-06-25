package com.espresso.tracker.service;

import com.espresso.tracker.dto.BeanRequestDTO;
import com.espresso.tracker.dto.BeanResponseDTO;
import com.espresso.tracker.entity.Bean;
import com.espresso.tracker.exception.ResourceNotFoundException;
import com.espresso.tracker.repository.BeanRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service for managing coffee beans.
 */
@Service
public class BeanService {

    private final BeanRepository beanRepository;

    public BeanService(BeanRepository beanRepository) {
        this.beanRepository = beanRepository;
    }

    /**
     * Retrieve a paginated list of active beans.
     */
    @Transactional(readOnly = true)
    public Page<BeanResponseDTO> getAllActiveBeans(Pageable pageable) {
        return beanRepository.findByIsActiveTrue(pageable)
                .map(this::mapToResponseDTO);
    }

    /**
     * Retrieve a single bean by ID.
     */
    @Transactional(readOnly = true)
    public BeanResponseDTO getBeanById(UUID id) {
        Bean bean = beanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bean not found with id: " + id));
        return mapToResponseDTO(bean);
    }

    /**
     * Add a new bag of beans.
     */
    @Transactional
    public BeanResponseDTO createBean(BeanRequestDTO requestDTO) {
        Bean bean = new Bean();
        mapToEntity(requestDTO, bean);
        Bean savedBean = beanRepository.save(bean);
        return mapToResponseDTO(savedBean);
    }

    /**
     * Update an existing bean.
     */
    @Transactional
    public BeanResponseDTO updateBean(UUID id, BeanRequestDTO requestDTO) {
        Bean bean = beanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bean not found with id: " + id));
        
        mapToEntity(requestDTO, bean);
        Bean updatedBean = beanRepository.save(bean);
        return mapToResponseDTO(updatedBean);
    }

    /**
     * Soft delete a bean (set isActive to false).
     */
    @Transactional
    public void softDeleteBean(UUID id) {
        Bean bean = beanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bean not found with id: " + id));
        bean.setIsActive(false);
        beanRepository.save(bean);
    }

    // --- Mappers ---

    private void mapToEntity(BeanRequestDTO dto, Bean entity) {
        entity.setRoasterName(dto.getRoasterName());
        entity.setBeanName(dto.getBeanName());
        entity.setOrigin(dto.getOrigin());
        entity.setRoastLevel(dto.getRoastLevel());
        entity.setTastingNotes(dto.getTastingNotes());
    }

    private BeanResponseDTO mapToResponseDTO(Bean entity) {
        BeanResponseDTO dto = new BeanResponseDTO();
        dto.setId(entity.getId());
        dto.setRoasterName(entity.getRoasterName());
        dto.setBeanName(entity.getBeanName());
        dto.setOrigin(entity.getOrigin());
        dto.setRoastLevel(entity.getRoastLevel());
        dto.setTastingNotes(entity.getTastingNotes());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
