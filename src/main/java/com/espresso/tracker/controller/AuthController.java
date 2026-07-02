package com.espresso.tracker.controller;

import com.espresso.tracker.dto.LoginRequest;
import com.espresso.tracker.dto.LoginResponse;
import com.espresso.tracker.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication API", description = "Endpoints for user authentication and JWT token generation")
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  @PostMapping("/login")
  @Operation(summary = "Authenticate user", description = "Authenticates with username and password, returns a JWT token.")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.username(), request.password()));

    String username = authentication.getName();
    String role = authentication.getAuthorities().stream()
        .findFirst()
        .map(g -> g.getAuthority().replace("ROLE_", ""))
        .orElse("USER");

    String token = jwtService.generateToken(username, Map.of("role", role));

    return new ResponseEntity<>(new LoginResponse(token, username, role), HttpStatus.OK);
  }
}