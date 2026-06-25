package com.espresso.tracker.controller;

import com.espresso.tracker.dto.BrewLogRequestDTO;
import com.espresso.tracker.dto.BrewLogResponseDTO;
import com.espresso.tracker.service.BrewLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for logging and retrieving espresso extractions.
 */
@RestController
@RequestMapping("/api/v1/brew-logs")
@Tag(name = "Brew Logs API", description = "Endpoints for logging espresso extractions")
public class BrewLogController {

    private final BrewLogService brewLogService;

    public BrewLogController(BrewLogService brewLogService) {
        this.brewLogService = brewLogService;
    }

    @PostMapping
    @Operation(summary = "Log a new brew", description = "Logs a new espresso extraction tied to a specific bean.")
    public ResponseEntity<BrewLogResponseDTO> logBrew(@Valid @RequestBody BrewLogRequestDTO requestDTO) {
        BrewLogResponseDTO loggedBrew = brewLogService.createBrewLog(requestDTO);
        return new ResponseEntity<>(loggedBrew, HttpStatus.CREATED);
    }

    @GetMapping("/bean/{beanId}")
    @Operation(summary = "Get brew logs for a bean", description = "Retrieves all brew logs associated with a specific bean ID.")
    public ResponseEntity<List<BrewLogResponseDTO>> getLogsByBeanId(@PathVariable UUID beanId) {
        return ResponseEntity.ok(brewLogService.getLogsByBeanId(beanId));
    }

    @GetMapping("/top-rated")
    @Operation(summary = "Get top-rated extractions", description = "Retrieves all brew logs with a rating of 4 or 5 stars.")
    public ResponseEntity<List<BrewLogResponseDTO>> getTopRatedExtractions() {
        return ResponseEntity.ok(brewLogService.getTopRatedExtractions());
    }
}
