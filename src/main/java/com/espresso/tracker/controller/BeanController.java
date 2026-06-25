package com.espresso.tracker.controller;

import com.espresso.tracker.dto.BeanRequestDTO;
import com.espresso.tracker.dto.BeanResponseDTO;
import com.espresso.tracker.service.BeanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller for managing coffee beans.
 */
@RestController
@RequestMapping("/api/v1/beans")
@Tag(name = "Beans API", description = "Endpoints for managing coffee beans inventory")
public class BeanController {

    private final BeanService beanService;

    public BeanController(BeanService beanService) {
        this.beanService = beanService;
    }

    @GetMapping
    @Operation(summary = "Get all active beans", description = "Retrieves a paginated list of all active coffee beans.")
    public ResponseEntity<Page<BeanResponseDTO>> getAllBeans(Pageable pageable) {
        return ResponseEntity.ok(beanService.getAllActiveBeans(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a bean by ID", description = "Retrieves a single coffee bean by its UUID.")
    public ResponseEntity<BeanResponseDTO> getBeanById(@PathVariable UUID id) {
        return ResponseEntity.ok(beanService.getBeanById(id));
    }

    @PostMapping
    @Operation(summary = "Add a new bean", description = "Adds a new bag of coffee beans to the inventory.")
    public ResponseEntity<BeanResponseDTO> createBean(@Valid @RequestBody BeanRequestDTO requestDTO) {
        BeanResponseDTO createdBean = beanService.createBean(requestDTO);
        return new ResponseEntity<>(createdBean, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a bean", description = "Updates details for an existing coffee bean.")
    public ResponseEntity<BeanResponseDTO> updateBean(@PathVariable UUID id, @Valid @RequestBody BeanRequestDTO requestDTO) {
        return ResponseEntity.ok(beanService.updateBean(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a bean", description = "Soft deletes a coffee bean by setting its active status to false.")
    public ResponseEntity<Void> deleteBean(@PathVariable UUID id) {
        beanService.softDeleteBean(id);
        return ResponseEntity.noContent().build();
    }
}
